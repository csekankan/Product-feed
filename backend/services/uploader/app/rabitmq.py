import pika
import json
import os
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Header
from app.config import RABBITMQ_URL
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

# Function to send message to RabbitMQ
def send_to_rabbitmq(task_id: str):
    try:
        connection =  get_connection()
        channel = connection.channel()
        channel.queue_declare(queue='task_queue', durable=True)
        message = json.dumps({"task_id": task_id})
        channel.basic_publish(
            exchange='',
            routing_key='task_queue',  
            body=message,
            properties=pika.BasicProperties(
                delivery_mode=2,  # Make message persistent
            )
        )
        print(f" [x] Sent {message}")
        connection.close()
    except Exception as e:
        print(f"Error sending to RabbitMQ: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to send task to RabbitMQ")
