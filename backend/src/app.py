import os
import json
import logging
import datetime
import stripe

from flask import Flask, request, jsonify
from flask_restful import Api
from flask_jwt_extended import JWTManager, jwt_required, create_access_token
from flask_cors import CORS, cross_origin
from botocore.exceptions import NoCredentialsError, PartialCredentialsError
from werkzeug.utils import secure_filename

from configs.s3 import ImageBucket
from utils.security import authenticate, generate_verification_code, send_code_to_email
from utils.email import send_email, generate_receipt
from resources.user import RUser, UserRegister, UserList
from resources.item import RItem, ItemList, FilteredItemList
from resources.ticket import RTicket, RGuestTicket, TicketList, GuestTicketList, AllTicketsList
from resources.admin_app import AdminAppUserResource, AdminAppAdminResource, AdminAppListResource

from constants import CORS_ALLOWED_ORIGINS

from models.item import Item

logging.basicConfig(level=logging.DEBUG)

config_file = open(f'{os.getcwd()}\\backend\\src\\configs.json')
configs = json.load(config_file)

app = Flask(__name__)
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///my_data.db'
app.secret_key = configs["app_secret_key"]
api = Api(app)

cors = CORS(app, resources={ r"/*": {"origins": CORS_ALLOWED_ORIGINS }})
jwt = JWTManager(app) # creates /auth endpoint

# Prepare S3 Bucket for image storage
image_bucket = ImageBucket(configs) 
s3_client = image_bucket.get_s3_client()

stripe.api_key=configs['stripe_secret_key']

api.add_resource(UserRegister, "/register")
api.add_resource(RUser, "/user/<string:username>")
api.add_resource(UserList, "/users")
api.add_resource(RItem, "/item/<string:name>")
api.add_resource(ItemList, "/items")
api.add_resource(FilteredItemList, "/fitems")
api.add_resource(RTicket, "/ticket")
api.add_resource(RGuestTicket, "/guest_ticket")
api.add_resource(TicketList, "/tickets")
api.add_resource(GuestTicketList, "/guest_tickets")
api.add_resource(AllTicketsList, "/all_tickets")
api.add_resource(AdminAppUserResource, "/admin_app")
api.add_resource(AdminAppAdminResource, '/admin_app/<int:app_id>')
api.add_resource(AdminAppListResource, "/admin_apps")

@app.route("/verify", methods=["POST"])
@cross_origin(origins=CORS_ALLOWED_ORIGINS)
def send_verification_code():
    try:
        verification_code = generate_verification_code()

        send_code_to_email(request.json.get('email'), verification_code)

        return { 'code': verification_code }, 200
    except Exception as e:
        return { 'message': f"An error occurred while sending out the verification code! Error: {str(e)}"}, 500

@app.route('/create-checkout-session', methods=['POST'])
@cross_origin(origins=CORS_ALLOWED_ORIGINS)
@jwt_required()
def checkout():
    try:
        items = request.json.get('items')
        frontend_url = request.headers.get('Origin')
        line_items = []

        for item in items:
            line_items.append(                
                {
                    "price_data": {
                        "currency": "usd",
                        "product_data": {"name": item['name']},
                        "unit_amount": item['price'],
                    },
                    "quantity": item['quantity'],
                },
            )

        session = stripe.checkout.Session.create(
            line_items=line_items,
            mode="payment",
            ui_mode="custom",
            # The URL of your payment completion page
            return_url=f"{frontend_url}/thank-you",
        )

        # for index in range(len(items)):
        #     subtract_item_quantity = float(items[index]['quantity'])

        #     db_items[index].quantity -= subtract_item_quantity
        #     db_items[index].save_item()

        # send_email(user['email'], "SheeBay Order Confirmation", generate_receipt(items, user), is_html=True)

        # with open("sales.log", 'a') as file:
        #     file.write(f"[{datetime.datetime.now()}] - Sale of {db_items} made to {user['first_name']} {user['last_name']}")
        #     file.close()

        return jsonify({
            'checkoutSessionClientSecret': session['client_secret']
        })
    except Exception as e:
        return jsonify(error=str(e)), 403
    
@app.route('/checkout-success', methods=['POST'])
@cross_origin(origins=CORS_ALLOWED_ORIGINS)
@jwt_required
def checkout_success():
    try:
        items = request.json.get('items')
        user = request.json.get('user')
    
        for index in range(len(items)):
            subtract_item_quantity = float(items[index]['quantity'])

            items[index].quantity -= subtract_item_quantity
            items[index].save_item()

        send_email(user['email'], "SheeBay Order Confirmation", generate_receipt(items, user), is_html=True)

        with open("sales.log", 'a') as file:
            file.write(f"[{datetime.datetime.now()}] - Sale of {items} made to {user['first_name']} {user['last_name']}\n")
            file.close()
    except Exception as err:
        return { 'message': f'An error occurred while processing your checkout! Error: {str(err)}' }, 500

    
@app.route('/create-subscription-checkout-session', methods=['POST'])
@cross_origin(origins=CORS_ALLOWED_ORIGINS)
@jwt_required()
def checkout_subscription():
    try:
        user = request.json.get('user')
        seller_plan = request.json.get('sellerPlan')
        frontend_url = request.headers.get('Origin')

        stripe_seller_plan = stripe.Product.retrieve(seller_plan['stripe_id'])

        # Retrieve the price ID from the seller plan product
        price_id = stripe_seller_plan['default_price'] if 'default_price' in stripe_seller_plan else None
        if not price_id:
            raise Exception("No default price found for the selected seller plan.")

        session = stripe.checkout.Session.create(
            mode="subscription",
            line_items=[
                {
                    "price": price_id,
                    "quantity": 1
                }
            ],
            subscription_data={
                "description": "\n".join(seller_plan['details']),
            },
            success_url=f"{frontend_url}/thank-you",
            # cancel_url=f"{frontend_url}/thank-you",
            # payment_method_collection="if_required",
        )

        send_email(user['email'], "SheeBay Order Confirmation", generate_receipt(seller_plan, user, True), is_html=True)

        with open("sales.log", 'a') as file:
            file.write(f"[{datetime.datetime.now()}] - Subscription {seller_plan['name']} purchased by {user['first_name']} {user['last_name']}\n")
            file.close()

        return jsonify({
            'checkoutSessionUrl': session.url
        })
    except Exception as e:
        return jsonify(error=str(e)), 403
    
@app.route("/auth", methods=['POST'])
@cross_origin(origins=CORS_ALLOWED_ORIGINS)
def auth():
    user = auth_user(request)

    if user is None:
        return { 'message': 'Incorrect username and/or password! Please try again.' }, 400
    
    access_token = create_access_token(identity=user.username)
    return jsonify(access_token=access_token), 200


@app.route('/soft_auth', methods=['POST'])
@cross_origin(origins=CORS_ALLOWED_ORIGINS)
def soft_auth():
    user = auth_user(request)

    if user is None:
        return { 'message': 'Incorrect username and/or password! Please try again.' }, 400
    
    return user.json(), 200

@app.route('/upload', methods=['POST'])
@cross_origin(origins=CORS_ALLOWED_ORIGINS)
def upload_image():
    try:
        # Check if the request contains a file
        if 'file' not in request.files:
            return jsonify({"error": "No file part in the request"}), 400

        file = request.files['file']

        if file.filename == '':
            return jsonify({"error": "No file selected for uploading"}), 400

        # Secure the filename and prepare it for upload
        filename = secure_filename(file.filename)
        aws_bucket_name = image_bucket.get_bucket_name()
        aws_region_name = image_bucket.get_region_name()

        # Upload the file to S3
        s3_client.upload_fileobj(
            file,
            aws_bucket_name,
            filename,
            ExtraArgs={"ContentType": file.content_type}
        )
      
        # Generate the file URL
        file_url = f"https://{aws_bucket_name}.s3.{aws_region_name}.amazonaws.com/{aws_bucket_name}/{filename}"

        return jsonify({"message": "File uploaded successfully", "url": file_url}), 200

    except NoCredentialsError:
        return jsonify({"error": "AWS credentials not found"}), 500

    except PartialCredentialsError:
        return jsonify({"error": "Incomplete AWS credentials"}), 500

    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@app.route('/visits')
@cross_origin(origins=CORS_ALLOWED_ORIGINS)
def get_website_visits():
    try:
        with open('access.log', 'r') as log:
            log_lines = log.readlines()
            return jsonify({"visits": len(log_lines)}), 200 
    except FileNotFoundError as err:
        print("WARNING: File not found!")
        return jsonify({"visits": 0})

@app.route('/sales')
@cross_origin(origins=CORS_ALLOWED_ORIGINS)
def get_total_sales():
    try:
        with open('sales.log', 'r') as log:
            log_lines = log.readlines()
            return jsonify({"sales": len(log_lines)}), 200
    except FileNotFoundError as err:
        print("WARNING: File not found!")
        return jsonify({"sales": 0}), 200

def auth_user(request):
    username = request.json.get('username')
    password = request.json.get('password')

    user = authenticate(username, password)

    return user