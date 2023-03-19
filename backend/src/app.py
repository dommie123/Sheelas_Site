from flask import Flask
from flask_restful import Api
from flask_jwt import JWT

from utils.security import authenticate, identity
from resources.user import RUser, UserRegister
from resources.item import RItem, ItemList

app = Flask(__name__)
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///my_data.db'
app.secret_key = 'Ass'
api = Api(app)

jwt = JWT(app, authenticate, identity) # creates /auth endpoint

api.add_resource(UserRegister, "/register")
api.add_resource(RUser, "/user/<string:username>")
api.add_resource(RItem, "/item/<string:name>")
api.add_resource(ItemList, "/items")