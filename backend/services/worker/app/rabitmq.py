import pika
import time

# TODO: Think of way to deal with it
def get_connection():
    while True:
        try:
            connection = pika.BlockingConnection(pika.URLParameters('amqp://guest:guest@rabbitmq:5672/'))
            return connection
        except pika.exceptions.AMQPConnectionError as e:
            print(f"Failed to connect to RabbitMQ, retrying in 5 seconds... Error: {e}")
            time.sleep(5)
