from db import db

class Ticket(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    product_name = db.Column(db.String(80))
    is_seller = db.Column(db.Boolean)
    issue = db.Column(db.String(80))
    comments = db.Column(db.String(250))

    user_id = db.Column(db.Integer, db.ForeignKey("users.id"))
    user = db.relationship("User")

    def __init__(self, product_name, is_seller, issue, comments):
        self.product_name = product_name
        self.is_seller = is_seller
        self.issue = issue
        self.comments = comments

    def json(self):
        return {
            'id': self.id,
            'product_name': self.product_name,
            'is_seller': self.is_seller,
            'issue': self.issue,
            'comments': self.comments,
        }
    
    def save_ticket(self):
        db.session.add(self)
        db.session.commit()

    def delete_ticket(self):
        db.session.delete(self)
        db.session.commit()

    @classmethod
    def find_by_id(cls, ticket_id):
        return cls.query.filter_by(id=ticket_id).first()
