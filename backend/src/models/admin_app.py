from db import db

class AdminApp(db.Model):
    __tablename__ = "admin_applications"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    status = db.Column(db.String(80))
    message = db.Column(db.String(80))
    created_at = db.Column(db.DateTime, server_default=db.func.now())   # server_default sets the default value, so I don't need to update it manually.
    updated_at = db.Column(db.DateTime, server_default=db.func.now(), server_onupdate=db.func.now())

    def __init__(self, user_id, status, message) -> None:
        self.user_id = user_id
        self.status = status
        self.message = message

    def json(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'status': self.status,
            'message': self.message,
            'created_at': self.created_at.strftime('%Y-%m-%d %H:%M:%S'),  # Convert datetime to string
            'updated_at': self.updated_at.strftime('%Y-%m-%d %H:%M:%S')
        }

    def save_application(self):
        db.session.add(self)
        db.session.commit()

    def delete_application(self):
        db.session.delete(self)
        db.session.commit()

    @classmethod
    def find_by_id(cls, id):
        return cls.query.filter_by(id=id).first()
    