# Created this module to avoid circular imports in Security module
import os
import hashlib
import json

def hash_password(password):
    config_file = open(f'{os.getcwd()}\\backend\\src\\configs.json')
    configs = json.load(config_file)
    h = hashlib.sha256()
    salt = configs['salt']
    _hash = f"{password}{salt}".encode('utf-8')

    h.update(_hash)

    return h.hexdigest()