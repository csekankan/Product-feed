from pydantic import BaseModel
from typing import Optional

class ProductCreate(BaseModel):
    store_id: int
    sku: str
    product_name: str
    price: float

class ProductUpdate(BaseModel):
    price: float
    product_name: Optional[str] = None
