from db import db

class Item(db.Model):
    __tablename__ = "items"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80))
    description = db.Column(db.String(200))
    quantity = db.Column(db.Integer)
    price = db.Column(db.Float)

    seller_id = db.Column(db.Integer, db.ForeignKey("users.id"))
    seller = db.relationship("User")

    def __init__(self, name, description, quantity, price, seller_id):
        self.name = name
        self.description = description
        self.quantity = quantity
        self.price = price
        self.seller_id = seller_id

    def json(self):
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'quantity': self.quantity,
            'price': self.price,
        }
    
    def save_item(self):
        db.session.add(self)
        db.session.commit()

    def delete_item(self):
        db.session.delete(self)
        db.session.commit()

    @classmethod
    def find_by_id(cls, item_id):
        return cls.query.filter_by(id=item_id).first()
    
    @classmethod
    def find_by_name(cls, item_name):
        return cls.query.filter_by(name=item_name).first()
