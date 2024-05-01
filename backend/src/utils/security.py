import os
import random
import hashlib
import json

from models.user import User
from utils.email import send_email
from utils.passwords import hash_password

# Retrieves a user by their username if they exist in the database and they typed the correct password.
def authenticate(username, password):
    user = User.find_by_username(username)

    if user and user.password == hash_password(password):
        return user

# Retrieves a user by their id if they exist in the database.
def identity(payload):
    user_id = payload['identity']
    return User.find_by_id(user_id)

# Generates a verification code and sends it to the user via email.
def generate_verification_code():
    return str(random.randint(0, 999999)).zfill(6)

def send_code_to_email(recipient_email, verification_code):
    send_email(
        recipient_email, 
        "Your Verification Code", 
        f"Hello!\n\nYour verification code is {verification_code}. Please do not share this code with anyone! \n\nThank you, \nSheela's Shopping Site."
    )
