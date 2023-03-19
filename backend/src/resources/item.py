import sqlite3
from flask_restful import Resource, reqparse

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
    
    def post(self, name):
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
    
    def put(self, name):
        data = self.parser.parse_args()
        item = Item.find_by_name(name)
        status_code = 202

        if item is None:
            item = Item(name, **data)
            status_code = 201
        else:
            item.qunatity = data['quantity']
            item.description = data['description']
            item.price = data['price']
            status_code = 200
        
        item.save_item()
        return item.json(), status_code
    
    def delete(self, name):
        item = Item.find_by_name(name)

        if item:
            item.delete_item()

        return {"message": "Success"}, 410
    
class ItemList(Resource):
    def get(self):
        return {"items": [item.json() for item in Item.query.all()]}, 200