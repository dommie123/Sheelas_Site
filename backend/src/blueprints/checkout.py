import stripe
import datetime

from flask import Blueprint, jsonify, request
from flask_cors import cross_origin
from flask_jwt_extended import jwt_required

from utils.email import send_email, generate_receipt

from models.item import Item

from constants import CORS_ALLOWED_ORIGINS


checkout_bp = Blueprint('checkout', __name__, url_prefix='/checkout')

@checkout_bp.route('/create-checkout-session', methods=['POST'])
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

        return jsonify({
            'checkoutSessionClientSecret': session['client_secret']
        })
    except Exception as e:
        return jsonify(error=str(e)), 403
    
@checkout_bp.route('/checkout-success', methods=['POST'])
@cross_origin(origins=CORS_ALLOWED_ORIGINS)
@jwt_required()
def checkout_success():
    try:
        items = request.json.get('items')
        user = request.json.get('user')
    
        for item in items:
            db_item = Item.find_by_id(int(item['id']))
            subtract_item_quantity = int(item['quantity'])

            db_item.quantity -= subtract_item_quantity
            db_item.save_item()

        send_email(user['email'], "SheeBay Order Confirmation", generate_receipt(items, user), is_html=True)

        with open("sales.log", 'a') as file:
            file.write(f"[{datetime.datetime.now()}] - Sale of {items} made to {user['first_name']} {user['last_name']}\n")
            file.close()

        return { 'message': 'Transaction complete!' }, 200
    except Exception as err:
        return { 'message': f'An error occurred while processing your checkout! Error: {str(err)}' }, 500
    

@checkout_bp.route('/create-subscription-checkout-session', methods=['POST'])
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