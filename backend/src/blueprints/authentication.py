from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token
from flask_cors import cross_origin

from utils.security import authenticate, generate_verification_code, send_code_to_email

from constants import CORS_ALLOWED_ORIGINS


authentication_bp = Blueprint('authentication', __name__, url_prefix='/authentication')

@authentication_bp.route("/verify", methods=["POST"])
@cross_origin(origins=CORS_ALLOWED_ORIGINS)
def send_verification_code():
    try:
        verification_code = generate_verification_code()

        send_code_to_email(request.json.get('email'), verification_code)

        return { 'code': verification_code }, 200
    except Exception as e:
        return { 'message': f"An error occurred while sending out the verification code! Error: {str(e)}"}, 500
    

@authentication_bp.route("/auth", methods=['POST'])
@cross_origin(origins=CORS_ALLOWED_ORIGINS)
def auth():
    user = auth_user(request)

    if user is None:
        return { 'message': 'Incorrect username and/or password! Please try again.' }, 400
    
    access_token = create_access_token(identity=user.username)
    return jsonify(access_token=access_token), 200


@authentication_bp.route('/soft_auth', methods=['POST'])
@cross_origin(origins=CORS_ALLOWED_ORIGINS)
def soft_auth():
    user = auth_user(request)

    if user is None:
        return { 'message': 'Incorrect username and/or password! Please try again.' }, 400
    
    return user.json(), 200


def auth_user(request):
    username = request.json.get('username')
    password = request.json.get('password')

    user = authenticate(username, password)

    return user