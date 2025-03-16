from sqlalchemy import Column, Integer, String, JSON
from app.db import Base

class ErrorRecord(Base):
    __tablename__ = "error_records"

    id = Column(Integer, primary_key=True, autoincrement=True)
    task_id = Column(String, nullable=False)  # Store as string to avoid FK constraints
    error_message = Column(String, nullable=False)
    row_data = Column(JSON, nullable=False)  # Store full row data for debugging
