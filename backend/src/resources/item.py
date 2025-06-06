from flask_restful import Resource, reqparse
from flask_jwt_extended import jwt_required, get_jwt_identity

from models.item import Item

class RItem(Resource):
    parser = reqparse.RequestParser()
    parser.add_argument('description', 
        type=str,
        required=False    
    )
    parser.add_argument('price', 
        type=float,
        required=True,
        help="This field cannot be left blank!"
    )
    parser.add_argument('quantity',
        type=int,
        required=True,
        help="This field cannot be left blank!"
    )
    parser.add_argument('image_url', 
        type=str,
        required=True,
        help="This field cannot be left blank!"
    )
    parser.add_argument("seller_id",
        type=int,
        required=True,
        help="This item must belong to a seller!"                    
    )

    def get(self, name):
        item = Item.find_by_name(name)
        if item:
            return item.json(), 200
        return {"message": "This item does not exist in the database!"}, 404
    
    @jwt_required()
    def post(self, name):
        admin_token = get_jwt_identity()
        if not admin_token:
            return {'message': 'You do not have permission to access this endpoint!'}, 403

        item = Item.find_by_name(name)
        if item:
            return {"message": "This item already exists within the database!"}, 409
        
        data = self.parser.parse_args()

        if not data["description"]:
            data["description"] = ""
        
        item=Item(name, **data)

        try:
            item.save_item()
        except:
            return {"message": "An error occurred while creating this item"}, 500
        
        return item.json(), 201
    
    @jwt_required()
    def put(self, name):
        admin_token = get_jwt_identity()
        if not admin_token:
            return {'message': 'You do not have permission to access this endpoint!'}, 403

        data = self.parser.parse_args()
        item = Item.find_by_name(name)
        status_code = 202

        if item is None:
            item = Item(name, **data)
            status_code = 201
        else:
            item.quantity = data['quantity']
            item.description = data['description']
            item.price = data['price']
            status_code = 200
        
        item.save_item()
        return item.json(), status_code
    
    @jwt_required()
    def delete(self, name):
        admin_token = get_jwt_identity()
        if not admin_token:
            return {'message': 'You do not have permission to access this endpoint!'}, 403

        item = Item.find_by_name(name)

        if item:
            item.delete_item()

        return {"message": "Success"}, 410
    
class ItemList(Resource):
    def get(self):
        return {"items": [item.json() for item in Item.query.all()]}, 200
    
class FilteredItemList(Resource):
    parser = reqparse.RequestParser()
    parser.add_argument('search_term', 
        type=str,
        required=False                    
    )
    parser.add_argument('seller_id', 
        type=int,
        required=False                    
    )
    parser.add_argument('price', 
        type=float,
        required=False                    
    )

    def get(self):
        data = self.parser.parse_args()

        if not data['search_term']:
            data['search_term'] = ""

        search_term = data["search_term"].replace("\"", '')
        return {"items": [item.json() for item in Item.query.all() if search_term.lower() in item.name.lower()]}, 200
    
    def post(self):
        data = self.parser.parse_args()

        if not data['search_term']:
            data['search_term'] = ""

        search_term = data["search_term"].replace("\"", '')
        if not data['seller_id'] and not data['price']:
            return {"items": [item.json() for item in Item.query.all() if search_term.lower() in item.name.lower()]}, 200
        
        if data['seller_id']:
            if data["price"]:
                return {"items": [item.json() for item in Item.query.filter_by(seller_id=data["seller_id"]).all() if search_term.lower() in item.name.lower() and item.price <= data['price']]}
            return {"items": [item.json() for item in Item.query.filter_by(seller_id=data["seller_id"]).all() if search_term.lower() in item.name.lower()]}

        if data['price']:
            return {"items": [item.json() for item in Item.query.all() if search_term.lower() in item.name.lower() and item.price <= data['price']]}

