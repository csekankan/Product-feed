from sqlalchemy import Column, Integer, String, ForeignKey, TIMESTAMP, func,UUID
from sqlalchemy.orm import relationship
from app.db import Base

StatusTypes={
     "PENDING":1, 
    "PROCESSING":2,
    "COMPLETED":3, 
    "FAILED":4, 
}
class TaskStatus(Base):
    __tablename__ = "task_status"

    id = Column(Integer, primary_key=True, autoincrement=True)
    status_name = Column(String(50), unique=True, nullable=False)


class Task(Base):
    __tablename__ = "tasks"

    id = Column(Integer, primary_key=True, autoincrement=True)
    file_name = Column(String(255), nullable=False)
    status_id = Column(Integer, ForeignKey("task_status.id"), default=StatusTypes["PENDING"])
    created_at = Column(TIMESTAMP, server_default=func.now())
    store_id = Column(Integer)  
