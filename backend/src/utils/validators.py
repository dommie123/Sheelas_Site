import re

def validate_email(email): 
    return re.search("^[\\w\\-\\.]+@([\\w\\-]+\.)+[\\w\\-]{2,4}$", email)

def validate_phone(phone):
    return re.search("\\(?[0-9]{3}\\)?.?[0-9]{3}.?[0-9]{4}", phone)