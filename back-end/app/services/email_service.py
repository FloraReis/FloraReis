from flask_mail import Message
from app.extensions import mail

def send_email(subject, recipients, body):
    try:
        msg = Message(subject, recipients=recipients)
        msg.body = body
        mail.send(msg)
        return True
    except Exception as e:
        print(f"Erro ao enviar e-mail: {str(e)}")
        return False
