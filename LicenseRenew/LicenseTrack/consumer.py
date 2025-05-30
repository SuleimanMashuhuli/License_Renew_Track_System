import pika
import json
from django.core.mail import send_mail
import django
import os

import json
from channels.generic.websocket import AsyncWebsocketConsumer 


os.environ.setdefault("DJANGO_SETTINGS_MODULE", "LicenseRenew.settings")
django.setup()


             
def callback(ch, method, properties, body):
    data = json.loads(body)
    email = data['email']
    license_name = data['subscription_type']
    expiry_date = data['expiry_date']

    # Send Email Notification
    try:
        print("Sending email...")

        send_mail(
            subject=f"Renewal Reminder: {license_name}",
            message=f"Your '{license_name}' expires on {expiry_date}. Please renew it.",
            from_email="alisuleimann4@gmail.com",
            recipient_list=[email],
        )
        print(f" [✓] Sent renewal reminder to {email}")
        ch.basic_ack(delivery_tag=method.delivery_tag)

    
    except Exception as e:
        print(f" [X] Email failed for {email}: {str(e)}")
    
   
def start_consumer():
    
    connection = pika.BlockingConnection(pika.ConnectionParameters(host="localhost"))
    channel = connection.channel()

    channel.exchange_declare(exchange="license_exchange", exchange_type="direct")
    channel.queue_declare(queue="license_queue", durable=True)
    channel.queue_bind(exchange="license_exchange", queue="license_queue", routing_key="license_renewal")

    print(" [*] Waiting for messages. To exit press CTRL+C")

    # Consume Messages from Queue
    channel.basic_consume(queue="license_queue", on_message_callback=callback, auto_ack=False)

    channel.start_consuming()

if __name__ == "__main__":
    start_consumer()

