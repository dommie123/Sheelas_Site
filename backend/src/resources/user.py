import sqlite3
import re
from flask_restful import Resource, reqparse
from flask_jwt import jwt_required
from db import db

from utils.validators import validate_email, validate_phone
from models.user import User

class UserRegister(Resource):
    parser = reqparse.RequestParser()
    parser.add_argument('first_name', 
        type=str,
        required=True,
        help="This field cannot be blank!"
    )
    parser.add_argument('last_name', 
        type=str,
        required=True,
        help="This field cannot be blank!"
    )
    parser.add_argument('username', 
        type=str,
        required=True,
        help="This field cannot be blank!"
    )
    parser.add_argument('password', 
        type=str,
        required=True,
        help="This field cannot be blank!"
    )
    parser.add_argument('email', 
        type=str,
        required=True,
        help="Please enter a valid email address!"
    )
    parser.add_argument('phone', 
        type=str,
        required=False
    )

    def post(self):
        data = UserRegister.parser.parse_args()
        if User.find_by_username(data['username']):
            return {'message': 'This user already exists in the database!'}, 409
        
        user_email:str = data['email']
        user_phone:str = data['phone']

        if not validate_email(user_email):
            return {'message': f'{user_email} is not a valid email!'}, 400
        
        if user_phone and not validate_phone(user_phone):
            return {'message': f'{user_phone} is not in the correct format or is not valid!'}, 400
        
        user = User(**data)
        user.save_user()

        return {'message': 'User created successfully!'}, 201
    
class RUser(Resource):
    parser = reqparse.RequestParser()
    parser.add_argument('password', 
        type=str,
        required=True,
        help="This field cannot be blank!"
    )

    @classmethod
    def get(cls, username):
        user = User.find_by_username(username)
        if not user:
            return {'message': 'User not found!'}, 404
        return user.json(), 200
    
    @classmethod
    def put(cls, username):
        user = User.find_by_username(username)
        if not user:
            return {'message': 'User not found!'}, 404

        data = RUser.parser.parse_args()
        new_password = data['password']
        user.password = new_password
        db.session.commit()
        
        return user.json(), 200

    # Note* Have classmethod above jwt_required if I want to require authorization for a class method.
    @classmethod
    @jwt_required()
    def delete(cls, username):
        user = User.find_by_username(username)
        if not user:
            return {'message': 'User not found!'}, 404
        user.delete_user()
        return {'message': 'User deleted!'}, 200