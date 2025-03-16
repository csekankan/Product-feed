from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.config.db import get_db
from app.model.store import Store
from app.schema.stores import StoreResponse
from typing import List

store_router = APIRouter(prefix="/stores", tags=["Stores"])

@store_router.get("", response_model=List[StoreResponse])
def get_all_stores(db: Session = Depends(get_db)):
    """ Fetch all stores """
    try:
        stores = db.query(Store).all()
        return stores
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")
