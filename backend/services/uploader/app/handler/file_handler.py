from abc import ABC, abstractmethod
from fastapi import HTTPException
import os
from io import BytesIO

class FileHandler(ABC):
    """
    Base class to handle file-related logic and validation.
    """
    def __init__(self, file, upload_dir):
        self.file = file
        self.upload_dir = upload_dir
        self.filename = file.filename
        self.file_content = None  
    
    @abstractmethod
    def process(self):
        """
        process logic for specific application
        """
        pass

    async  def save_file(self, file_path: str):
        try:
            # Using `await file.read()` to read the file content asynchronously
            with open(file_path, "wb") as buffer:
                # Write the file content to disk
                content = await self.file.read()
                buffer.write(content)
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"File upload failed: {str(e)}")
