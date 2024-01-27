import smtplib
import os
import json
import html

from email.message import EmailMessage
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

def send_email(recipient_email, subject, content, is_html=False):
    msg = EmailMessage() if not is_html else MIMEMultipart("alternative")

    if not is_html:
        msg.set_content(content)

    msg['Subject'] = subject
    msg['From'] = "sheelabot69420@gmail.com"
    msg['To'] = recipient_email

    config_file = open(f'{os.getcwd()}\\backend\\src\\configs.json')
    configs = json.load(config_file)
    
    server = smtplib.SMTP("smtp.gmail.com:587")
    server.starttls()
    server.login("sheelabot69420@gmail.com", configs['password'])
    if not is_html:
        server.send_message(msg)
    else:
        html_content = MIMEText(content, "html")

        msg.attach(html_content)

        server.sendmail("sheelabot69420@gmail.com", recipient_email, msg.as_string())
    server.quit()

def generate_receipt(cart_items, user_info):
    cart_items_html = [f'<tr><td>{item["name"]}</td><td>{item["quantity"]}</td><td>{item["price"]}</td></tr>' for item in cart_items]
    cart_items_string = '\n'.join(cart_items_html)
    css_styles = """
        html {
            width: 100%;
        }
        
        body {
            margin: 0;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
                'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
                sans-serif;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
            width: 100%;
            height: 100%;
            overflow: auto;
        }

        table {
            width: 100%;
        }

        h1 {
            font-size: 20pt;
            font-weight: bold;
        }

        h2 {
            font-size: 16pt;
        }

        h3 {
            font-size: 15pt;
        }

        footer {
            margin-top: -5px;
            padding-left: 10px;
        }

        thead {
            border-bottom: 2px solid lightgray;
            margin-bottom: 5px;
        }

        tr {
            display: flex;
            flex-direction: row;
            justify-content: space-between;
        }

        .table-head-row {
            background-color: green;
            color: white;
        }

    """
    total = 0
    for item in cart_items:
        total += float(item['price'][1:])

    total_as_string = "{:.2f}".format(total)

    return f"""<!DOCTYPE html>
    <html>
        <head>
            <style>
                {css_styles}
            </style>
        </head>
        <body>
            <header>
                <h1>Thank you for your purchase from SheBay!</h1>
                <br>
                <h2>You will find your receipt below: </h2>
            </header>
            <br>
            <section>
                <article>
                    <b>{user_info['first_name']} {user_info['last_name']} </b>
                    <p>{user_info['email']}</p>
                </article>
                <br>
                <h3>Order Details</h3>
                <table>
                    <theader>
                        <tr class='table-head-row'><td>Product Name</td><td>Quantity</td><td>Price</td></tr>
                    </theader>
                    <tbody>
                        {cart_items_string}
                    </tbody>
                </table>
                <br>
                <p><b>Total: ${total_as_string}</b></p> 
            </section>
            <br>
            <footer>
                <p>For questions about your order, please submit a ticket via our Contact page.</p>
                <p>To opt out of these emails, please click <a href='#'>here.</a></p>
            </footer>
        </body>
    </html>"""