from pydantic import BaseModel

class TaskCreateRequest(BaseModel):
    file_name: str

class TaskUpdateRequest(BaseModel):
    id:int
    status_id: int