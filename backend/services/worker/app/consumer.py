import threading
import logging
import pika
import json
import pandas as pd
from app.config import RABBITMQ_URL, DIR
from app.product_feed import process_csv_with_pandas
from app.rabitmq import get_connection

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

MAX_CONCURRENT_TASKS = 10  # Maximum number of tasks to process concurrently

processing_tasks = 0

def consume_from_rabbitmq():
    connection = get_connection()
    channel = connection.channel()

    # Declare the queue to ensure it exists
    channel.queue_declare(queue="task_queue", durable=True)

    # Set up the consumer to listen for messages
    channel.basic_consume(queue="task_queue", on_message_callback=callback, auto_ack=False)

    logger.info("Worker is waiting for messages...")

    # Start consuming messages from RabbitMQ
    while True:
        if processing_tasks < MAX_CONCURRENT_TASKS:
            channel.connection.process_data_events(time_limit=None)
        else:
            logger.info("Waiting for tasks to be processed...")

# Start the worker in a separate thread so the FastAPI app can run in parallel
def start_worker():
    worker_thread = threading.Thread(target=consume_from_rabbitmq)
    worker_thread.daemon = True  # Daemon thread to run in the background
    worker_thread.start()

# RabbitMQ Callback Function to process the tasks
def callback(ch, method, properties, body):
    global processing_tasks
    if processing_tasks >= MAX_CONCURRENT_TASKS:
        logger.info("Max concurrent tasks reached. Waiting for task completion.")
        return

    try:
        # Parse the message body
        message = json.loads(body)
        task_id = message["task_id"]
        processing_tasks += 1
        logger.info(f"Received task with ID: {task_id}, processing task {processing_tasks}/{MAX_CONCURRENT_TASKS}")
        
        # Process the task (e.g., process CSV)
        process_csv_with_pandas(task_id)

        # Acknowledge the message to remove it from the queue
        ch.basic_ack(delivery_tag=method.delivery_tag)
        logger.info(f"Task {task_id} processed successfully.")
        
    except Exception as e:
        logger.error(f"Error processing task: {str(e)}")
        
        # Reject and remove the message from the queue (without requeuing)
        ch.basic_nack(delivery_tag=method.delivery_tag, requeue=False)
        logger.error(f"Task {task_id} failed, and message removed from queue.")
        
    finally:
        # Decrease task count once no matter what happens
        processing_tasks -= 1
