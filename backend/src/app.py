import os
import json

from flask import Flask, request
from flask_restful import Api
from flask_jwt import JWT
from flask_cors import CORS, cross_origin

from utils.security import authenticate, identity, generate_verification_code, send_code_to_email
from resources.user import RUser, UserRegister
from resources.item import RItem, ItemList
from resources.ticket import RTicket, TicketList

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

@app.route("/verify", methods=["POST"])
@cross_origin(origins="http://localhost:3000")
def send_verification_code():
    try:
        verification_code = generate_verification_code()
        print(request.json.get('email'))
        send_code_to_email(request.json.get('email'), verification_code)
        return { 'code': verification_code }, 200
    except Exception as e:
        return { 'message': f"An error occurred while sending out the verification code! Error: {str(e)}"}, 500
