from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from app.config.db import Base

class Store(Base):
    __tablename__ = "stores"

    store_id = Column(Integer, primary_key=True, autoincrement=True)
    store_name = Column(String(255), nullable=False)
    pincode = Column(String(20), nullable=False)
    country = Column(String(100), nullable=False)

    products = relationship("Product", back_populates="store", cascade="all, delete-orphan")
    # Back-reference for Users
    users = relationship("User", back_populates="store", cascade="all, delete-orphan")
