from fastapi import FastAPI
from app.config.db import engine, Base
from app.router.authenticate  import auth_router
from app.router.tasks  import task_router
from app.router.products  import product_router
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Auth Service")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],  
    allow_headers=["*"], 
)
Base.metadata.create_all(bind=engine) 
app.include_router(auth_router)
app.include_router(task_router)
app.include_router(product_router)