from flask_restful import Resource, reqparse
from flask_jwt_extended import jwt_required, get_jwt_identity

from models.admin_app import AdminApp

class AdminAppResource(Resource):
    parser = reqparse.RequestParser()
    parser.add_argument('status', type=str, required=True, help='This field cannot be blank')
    parser.add_argument('message', type=str, required=True, help='This field cannot be blank')

    @jwt_required()
    def post(self):
        data = AdminAppResource.parser.parse_args()
        user_id = get_jwt_identity()
        admin_app = AdminApp(user_id, **data)
        admin_app.save_application()
        return {'message': 'Application submitted successfully'}, 201

    @jwt_required()
    def get(self):
        user_id = get_jwt_identity()
        admin_app = AdminApp.query.filter_by(user_id=user_id).first()
        if admin_app:
            return admin_app.json()
        return {'message': 'Application not found'}, 404

    @jwt_required()
    def delete(self):
        user_id = get_jwt_identity()
        admin_app = AdminApp.query.filter_by(user_id=user_id).first()
        if admin_app:
            admin_app.delete_application()
            return {'message': 'Application deleted successfully'}
        return {'message': 'Application not found'}, 404
    
class AdminAppListResource(Resource):
    @jwt_required()
    def get(self):
        return {'applications': [admin_app.json() for admin_app in AdminApp.query.all()]}