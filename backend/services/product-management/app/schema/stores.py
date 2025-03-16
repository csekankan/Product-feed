
from pydantic import BaseModel
class StoreResponse(BaseModel):
    store_id: int
    store_name: str
    pincode: str
    country: str

    class Config:
        from_attributes = True