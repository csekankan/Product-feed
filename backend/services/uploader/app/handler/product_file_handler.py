from  fastapi import HTTPException
import os
from app.handler.file_handler import FileHandler
from app.config import PRODUCT_API_URL
import requests
from app.config import UPLOAD_DIR
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Header

class ProductFileHandler(FileHandler):
    def __init__(self,header, file, upload_dir):
        self.file=file
        self.upload_dir=upload_dir
        self.header=header
    def validate(self):
            if not self.file.filename.endswith('.csv'):
                raise HTTPException(status_code=400, detail="Unsupported file type.")
    async def getTaskId(self):
            task_payload = {"file_name": self.file.filename}
            task_response =  requests.post(f"{PRODUCT_API_URL}/tasks/", json=task_payload, headers=self.header)

            if task_response.status_code != 201:
                raise HTTPException(
                status_code=500, 
                detail=f"Failed to create task entry: {task_response.status_code} {task_response.text}"
                )

            task_data =  task_response.json()
            task_id = task_data.get("task_id")

            if not task_id:
                raise HTTPException(status_code=500, detail="task ID missing in response")
            return task_id

    async def process(self):
            # self.validate()
            task_id=await self.getTaskId()
            # Get file extension
            _, file_extension = os.path.splitext(self.file.filename)

            # Rename file to task_id while keeping the extension
            new_filename = f"{task_id}{file_extension}"
            file_path = os.path.join(UPLOAD_DIR, new_filename)
            # Rename file to task_id while keeping the extension
            file_path = os.path.join(UPLOAD_DIR, new_filename)
            await self.save_file(file_path)
            return task_id


def get_product_file_handler(file: UploadFile = File(...), authorization: str = Header(...), upload_dir: str = UPLOAD_DIR) -> ProductFileHandler:
    """
    Factory function that creates and returns a ProductFileHandler instance.
    Uses FastAPI's dependency injection system.
    """
    header = {"Authorization": authorization}  # Or whatever you need for the header
    return ProductFileHandler(header=header, file=file, upload_dir=upload_dir)
   