from models.user import User

# Retrieves a user by their username if they exist in the database and they typed the correct password.
def authenticate(username, password):
    user = User.find_by_username(username)
    if user and user.password == password:
        return user

# Retrieves a user by their id if they exist in the database.
def identity(payload):
    user_id = payload['identity']
    return User.find_by_id(user_id)
