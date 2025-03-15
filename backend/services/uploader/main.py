from fastapi import FastAPI
from app.routes import router

app = FastAPI(title="File Upload Service")
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Auth Service")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],  
    allow_headers=["*"], 
)
app.include_router(router)

@app.get("/")
def root():
    return {"message": "File Upload Service is running"}