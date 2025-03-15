from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from app.config.db import get_db
from app.model.tasks import Task
from app.middleware.authentication import verify_auth
from app.schema.tasks import TaskCreateRequest, TaskUpdateRequest
from app.model.user import User

task_router = APIRouter(prefix="/tasks", tags=["tasks"])

@task_router.post("/", status_code=201)
def create_task(
    task_request: TaskCreateRequest,
    user = Depends(verify_auth),  # Ensure user is retrieved properly
    db: Session = Depends(get_db),
):
    try:
        new_task = Task( file_name=task_request.file_name)  
        db.add(new_task)
        db.commit()
        db.refresh(new_task)
        return {"task_id": new_task.id}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"An unexpected error occurred: {str(e)}")



@task_router.get("/{task_id}")
def get_task_status(task_id: int, user = Depends(verify_auth),db: Session = Depends(get_db)):
    task = db.query(Task).filter(Task.id == task_id).first()  
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    return {"task_id": task.id, "status_id": task.status_id}

@task_router.put("/{task_id}")
def update_task_status(task_id: int, task_update: TaskUpdateRequest,user: dict = Depends(verify_auth), db: Session = Depends(get_db)):
    try:
        task = db.query(Task).filter(Task.id == task_id).with_for_update().first()
        if not task:
            raise HTTPException(status_code=404, detail="Task not found")
        task.status_id = task_update.status_id
        db.commit()
        return {"message": "Task status updated", "task_id": task.id, "new_status_id": task.status_id}

    except Exception as e:
        # Catch any other exception and rollback
        db.rollback()
        raise HTTPException(status_code=500, detail=f"An unexpected error occurred: {str(e)}")

