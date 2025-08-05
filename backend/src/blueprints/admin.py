from flask import Blueprint, jsonify
from flask_cors import cross_origin

from constants import CORS_ALLOWED_ORIGINS


admin_bp = Blueprint('admin', __name__, url_prefix='/admin')

@admin_bp.route('/visits')
@cross_origin(origins=CORS_ALLOWED_ORIGINS)
def get_website_visits():
    try:
        with open('access.log', 'r') as log:
            log_lines = log.readlines()
            return jsonify({"visits": len(log_lines)}), 200 
    except FileNotFoundError as err:
        print("WARNING: File not found!")
        return jsonify({"visits": 0})


@admin_bp.route('/sales')
@cross_origin(origins=CORS_ALLOWED_ORIGINS)
def get_total_sales():
    try:
        with open('sales.log', 'r') as log:
            log_lines = log.readlines()
            return jsonify({"sales": len(log_lines)}), 200
    except FileNotFoundError as err:
        print("WARNING: File not found!")
        return jsonify({"sales": 0}), 200