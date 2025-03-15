import os
from dotenv import load_dotenv

load_dotenv()
import os
from dotenv import load_dotenv

load_dotenv()

UPLOAD_DIR = os.getenv("UPLOAD_DIR")
PRODUCT_API_URL = os.getenv("PRODUCT_API_URL")
RABBITMQ_URL= os.getenv("RABBITMQ_URL")
# Ensure upload directory exists
os.makedirs(UPLOAD_DIR, exist_ok=True)