import smtplib
import random
import json
import os

from models.user import User
from email.message import EmailMessage

# Retrieves a user by their username if they exist in the database and they typed the correct password.
def authenticate(username, password):
    user = User.find_by_username(username)
    if user and user.password == password:
        return user

# Retrieves a user by their id if they exist in the database.
def identity(payload):
    user_id = payload['identity']
    return User.find_by_id(user_id)

# Generates a verification code and sends it to the user via email.
def generate_verification_code():
    return str(random.randint(0, 999999)).zfill(6)

def send_code_to_email(recipient_email, verification_code):
    msg = EmailMessage()
    msg.set_content(f"Hello!\n\nYour verification code is {verification_code}. Please do not share this code with anyone! \n\nThank you, \nSheela's Shopping Site.")
    msg['Subject'] = "Your Verification Code"
    msg['From'] = "sheelabot69420@gmail.com"
    msg['To'] = recipient_email

    config_file = open(f'{os.getcwd()}\\backend\\src\\configs.json')
    configs = json.load(config_file)
    
    server = smtplib.SMTP("smtp.gmail.com:587")
    server.starttls()
    # print(f"Username: sheelabot69420@gmail.com \nPassword: {configs['password']}")
    server.login("dman9532@gmail.com", configs['password'])
    server.send_message(msg)
    server.quit()
