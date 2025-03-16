from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from app.config import DATABASE_URL

engine = create_engine(DATABASE_URL, pool_size=10, max_overflow=20)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Import models after the Base class is defined to avoid circular imports
from app.model.store import Store
from app.model.products import Product
from app.model.tasks import Task
# Create tables in the database (if needed)
Base.metadata.create_all(bind=engine)