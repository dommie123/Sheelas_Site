from flask import g
from app import app
from db import db

db.init_app(app)

@app.before_request
def create_tables():
    if not getattr(g, '_initialized', False):
        db.create_all()
        g._initialized = True

app.run(port=5000, debug=True)