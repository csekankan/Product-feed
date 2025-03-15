import os
from dotenv import load_dotenv
load_dotenv()

DIR = os.getenv("DIR")
DATABASE_URL = os.getenv("DATABASE_URL")
RABBITMQ_URL= os.getenv("RABBITMQ_URL")