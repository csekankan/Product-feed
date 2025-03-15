from sqlalchemy import Column, Integer, String, Numeric, TIMESTAMP, func
from app.db import Base

class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)
    store_id = Column(Integer, nullable=False)
    sku = Column(String(100), nullable=False)
    product_name = Column(String(255), nullable=False)
    price = Column(Numeric(10, 2), nullable=False)
    date = Column(TIMESTAMP, server_default=func.now(), nullable=False)
