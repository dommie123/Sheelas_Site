import os
import json
# import logging

from flask import Flask, request
from flask_restful import Api
from flask_jwt import JWT, jwt_required
from flask_cors import CORS, cross_origin

from utils.security import authenticate, identity, generate_verification_code, send_code_to_email
from resources.user import RUser, UserRegister
from resources.item import RItem, ItemList, FilteredItemList
from resources.ticket import RTicket, TicketList

from models.item import Item

# logging.basicConfig(level=logging.DEBUG)

config_file = open(f'{os.getcwd()}\\backend\\src\\configs.json')
configs = json.load(config_file)

app = Flask(__name__)
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///my_data.db'
app.secret_key = configs["app_secret_key"]
api = Api(app)

cors = CORS(app, origins=["http://localhost:3000"])

jwt = JWT(app, authenticate, identity) # creates /auth endpoint

api.add_resource(UserRegister, "/register")
api.add_resource(RUser, "/user/<string:username>")
api.add_resource(RItem, "/item/<string:name>")
api.add_resource(ItemList, "/items")
api.add_resource(RTicket, "/ticket")
api.add_resource(TicketList, "/tickets")
api.add_resource(FilteredItemList, "/fitems/<string:search_term>")

@app.route("/verify", methods=["POST"])
@cross_origin(origins="http://localhost:3000")
def send_verification_code():
    try:
        verification_code = generate_verification_code()

        send_code_to_email(request.json.get('email'), verification_code)

        return { 'code': verification_code }, 200
    except Exception as e:
        return { 'message': f"An error occurred while sending out the verification code! Error: {str(e)}"}, 500
    
@app.route('/checkout', methods=['POST'])
@cross_origin(origins='http://localhost:3000')
@jwt_required()
def checkout_items():
    try:
        items = request.json.get('items')
        db_items = [Item.find_by_id(item['id']) for item in items]

        for index in range(len(items)):
            db_items[index].quantity -= items[index]['quantity']
            db_items[index].save_item()

        return { 'message': "Thank you!" }, 200

    except Exception as e:
        return { 'message': f"An error occurred while processing your checkout! Error: {str(e)}"}, 500