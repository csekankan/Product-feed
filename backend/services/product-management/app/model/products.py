import sqlalchemy.orm
from sqlalchemy import Column, Integer, Numeric, String, TIMESTAMP, func, ForeignKey
from app.config.db import Base
from sqlalchemy.orm import relationship

class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)
    store_id =  Column(Integer, ForeignKey('stores.store_id'), nullable=False)  # Reference store_id
    sku_id = Column(String(100), unique=True, nullable=False)
    product_name = Column(String(255), nullable=False)
    price = Column(Numeric(10, 2), nullable=False)
    date = Column(TIMESTAMP, server_default=func.now(), nullable=False)
    store = relationship('Store', back_populates='products')