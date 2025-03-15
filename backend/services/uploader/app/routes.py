from fastapi import APIRouter, Depends, UploadFile, File, Header
import requests
import shutil
import os
from app.config import PRODUCT_API_URL
from app.validation import header_validation
from app.handler.product_file_handler import  get_product_file_handler,ProductFileHandler
from app.rabitmq import send_to_rabbitmq
router = APIRouter(prefix="/upload", tags=["File Upload"])

@router.post("/products")
async def upload_file(
    file: UploadFile = File(...), 
                      authorization: str = Header(...), 
                      file_handler: ProductFileHandler = Depends(get_product_file_handler)):

    task_id=await file_handler.process()
    send_to_rabbitmq(task_id)
    return {
        "task_id": task_id,
    }
