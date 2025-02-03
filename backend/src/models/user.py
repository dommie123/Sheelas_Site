from utils.passwords import hash_password
from enums.user import UserRole
from enums.seller import SellerPlan

from db import db

class User(db.Model):
    __tablename__ = "users"
    
    id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(db.String(80))
    last_name = db.Column(db.String(80))
    username = db.Column(db.String(80))
    password = db.Column(db.String(80))
    email = db.Column(db.String(80))
    phone = db.Column(db.String(80))
    twofa_enabled = db.Column(db.Boolean)
    role = db.Column(db.Integer)
    seller_plan = db.Column(db.Integer)

    def __init__(self, first_name, last_name, username, password, email, phone="", twofa_enabled=False, role=UserRole.BUYER.value, seller_plan=SellerPlan.NONE.value):
        self.first_name = first_name
        self.last_name = last_name
        self.username = username
        self.password = hash_password(password)
        self.email = email 
        self.phone = phone
        self.twofa_enabled = twofa_enabled
        self.role = role
        self.seller_plan = seller_plan

    def json(self):
        print(self)
        return {
            'id': self.id,
            'first_name': self.first_name,
            'last_name': self.last_name,
            'username': self.username,
            'email': self.email,
            'phone': self.phone,
            'twofa_enabled': self.twofa_enabled,
            'role': self.role,
            'seller_plan': self.seller_plan
        }
    
    def save_user(self):
        db.session.add(self)
        db.session.commit()

    def delete_user(self):
        db.session.delete(self)
        db.session.commit()

    @classmethod
    def find_by_username(cls, username):
        return cls.query.filter_by(username=username).first()
    
    @classmethod
    def find_by_id(cls, id):
        return cls.query.filter_by(id=id).first()