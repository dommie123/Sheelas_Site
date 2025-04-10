from flask import g, request
from app import app
from db import db

db.init_app(app)

@app.before_request
def create_tables():
    if not getattr(g, '_initialized', False):
        db.create_all()
        g._initialized = True
    
@app.before_request
def log_request():
    with open('access.log', 'a') as log:
        log.write(f"{request.remote_addr} - {request.method} {request.path}\n")

app.run(host="10.0.0.252", port=5000, debug=True)
# app.run(host="192.168.215.188", port=5000, debug=True)