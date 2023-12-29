from flask_restful import Resource, reqparse
from flask_jwt import jwt_required
from flask import request

from models.ticket import Ticket

class RTicket(Resource):
    parser = reqparse.RequestParser()
    parser.add_argument('product_name', 
        type=str,
        required=True,
        help="This field cannot be left blank!" 
    )
    parser.add_argument('is_seller', 
        type=bool,
        required=True,
        help="This field cannot be left blank!"
    )
    parser.add_argument('issue',
        type=str,
        required=True,
        help="This field cannot be left blank!"
    )
    parser.add_argument("comments",
        type=str,
        required=False,                    
    )

    @jwt_required()
    def post(self):   
        data = self.parser.parse_args()
        
        ticket=Ticket(**data)

        try:
            ticket.save_ticket()
        except:
            return {"message": "An error occurred while creating this ticket"}, 500
        
        return ticket.json(), 201
    
    @jwt_required()
    def delete(self):
        id = request.args.get("id")
        
        ticket = Ticket.find_by_id(id)
        if ticket:
            ticket.delete_ticket()

        return {"message": "Success"}, 410
    
class TicketList(Resource):
    def get(self):
        return {"tickets": [ticket.json() for ticket in Ticket.query.all()]}, 200