import os
import json
import logging

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
from resources.ticket import RTicket, TicketList

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

api.add_resource(UserRegister, "/register")
api.add_resource(RUser, "/user/<string:username>")
api.add_resource(UserList, "/users")
api.add_resource(RItem, "/item/<string:name>")
api.add_resource(ItemList, "/items")
api.add_resource(FilteredItemList, "/fitems")
api.add_resource(RTicket, "/ticket")
api.add_resource(TicketList, "/tickets")

@app.route("/verify", methods=["POST"])
@cross_origin(origins=CORS_ALLOWED_ORIGINS)
def send_verification_code():
    try:
        verification_code = generate_verification_code()

        send_code_to_email(request.json.get('email'), verification_code)

        return { 'code': verification_code }, 200
    except Exception as e:
        return { 'message': f"An error occurred while sending out the verification code! Error: {str(e)}"}, 500
    
@app.route('/checkout', methods=['POST'])
@cross_origin(origins=CORS_ALLOWED_ORIGINS)
@jwt_required()
def checkout_items():
    try:
        items = request.json.get('items')
        user = request.json.get('user')
        db_items = [Item.find_by_id(item['id']) for item in items]
        
        for index in range(len(items)):
            subtract_item_quantity = float(items[index]['quantity'])

            db_items[index].quantity -= subtract_item_quantity
            db_items[index].save_item()

        send_email(user['email'], "SheBay Order Confirmation", generate_receipt(items, user), is_html=True)
        return { 'message': "Thank you!" }, 200

    except Exception as e:
        return { 'message': f"An error occurred while processing your checkout! Error: {str(e)}"}, 500
    
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

def auth_user(request):
    username = request.json.get('username')
    password = request.json.get('password')

    user = authenticate(username, password)

    return user