from flask_restful import Resource, reqparse
from flask_jwt_extended import jwt_required, get_jwt_identity

from enums.user import UserRole

from models.user import User
from models.admin_app import AdminApp

class AdminAppUserResource(Resource):
    parser = reqparse.RequestParser()
    parser.add_argument('status', type=str, required=True, help='This field cannot be blank')
    parser.add_argument('message', type=str, required=True, help='This field cannot be blank')

    @jwt_required()
    def post(self):
        data = AdminAppUserResource.parser.parse_args()
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

class AdminAppAdminResource(Resource):
    parser = reqparse.RequestParser()
    parser.add_argument('status', type=str, required=True, help='This field cannot be blank')
    parser.add_argument('message', type=str, required=True, help='This field cannot be blank')

    @jwt_required()
    def put(self, app_id):
        data = AdminAppUserResource.parser.parse_args()
        username = get_jwt_identity()
        user = User.find_by_username(username)
        if user.role != UserRole.ADMIN.value: 
            return {'message': 'You do not have permission to alter this application'}, 403
        
        admin_app = AdminApp.find_by_id(app_id)
        if not admin_app:
            return {'message': 'Application not found'}, 404
        
        admin_app.status = data['status']
        admin_app.message = data['message']
        admin_app.save_application()
        return {'message': 'Application updated successfully'}, 200
    
    @jwt_required()
    def get(self, app_id):
        admin_app = AdminApp.find_by_id(app_id)
        if not admin_app:
            return {'message': 'Application not found'}, 404
        
        username = get_jwt_identity()
        user = User.find_by_username(username)
        print(f"User is {user.role}. Admin is {UserRole.ADMIN.value}.")
        if user.role != UserRole.ADMIN.value and admin_app.user_id != user.id:
            return {'message': 'You do not have permission to view this application'}, 403
        
        return admin_app.json(), 200
        
    
class AdminAppListResource(Resource):
    @jwt_required()
    def get(self):
        user_id = get_jwt_identity()
        user = User.find_by_id(user_id)
        if user.role != UserRole.ADMIN.value:
            return {'message': 'You do not have permission to view this resource'}, 403
    
        return {'applications': [admin_app.json() for admin_app in AdminApp.query.all()]}