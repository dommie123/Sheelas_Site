from db import db

# TODO save user's credit card info in a separate table.
class CreditCard(db.Model):
    __tablename__ = "credit_cards"

    id = db.Column(db.Integer, primary_key=True)
    card_number = db.Column(db.String(80))
    expiration_date = db.Column(db.String(80))
    cvv = db.Column(db.String(3))
    zip_code = db.Column(db.String(10))
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))    

    def __init__(self, card_number, expiration_date, cvv, zip_code, user_id) -> None:
        self.card_number = card_number
        self.expiration_date = expiration_date
        self.cvv = cvv
        self.zip_code = zip_code
        self.user_id = user_id

    def json(self):
        return {
            'id': self.id,
            'card_number': self.card_number,
            'expiration_date': self.expiration_date,
            'cvv': self.cvv,
            'zip_code': self.cvv,
            'user_id': self.user_id
        }
    
    def save_card(self):
        db.session.add(self)
        db.session.commit()

    def delete_card(self):
        db.session.delete(self)
        db.session.commit()

    @classmethod
    def find_by_user_id(cls, user_id):
        return cls.query.filter_by(user_id=user_id).first()
    
    @classmethod
    def find_by_id(cls, id):
        return cls.query.filter_by(id=id).first()

