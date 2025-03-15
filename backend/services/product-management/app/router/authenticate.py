from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import timedelta
from app.config.db import get_db
from app.model.user import User
from app.schema.auth  import UserCreate, Token
from app.auth.jwt import hash_password, verify_password, create_access_token,verify_access_token

auth_router = APIRouter(prefix="/auth", tags=["Authentication"])

@auth_router.post("/register", response_model=Token)
def register(user: UserCreate, db: Session = Depends(get_db)):
    existing_user = db.query(User).filter(User.email == user.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="user already registered")
    
    new_user = User(email=user.email, password_hash=hash_password(user.password))
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    access_token = create_access_token({"sub": new_user.email}, expires_delta=timedelta(minutes=30))
    return {"access_token": access_token, "token_type": "bearer"}

@auth_router.post("/login", response_model=Token)
def login(user: UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.email == user.email).first()
    if not db_user or not verify_password(user.password, db_user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    access_token = create_access_token({"sub": db_user.email}, expires_delta=timedelta(minutes=30))
    return {"access_token": access_token, "token_type": "bearer"}

# @auth_router.get("/verify")
# def verify(token: str, db: Session = Depends(get_db)):
#     """
#     Verify token and return user info.
#     """
#     try:
#         payload =verify_access_token(token)
#         email = payload.get("sub")
#         if email is None:
#             raise HTTPException(status_code=401, detail="Invalid token")

#         user = db.query(User).filter(User.email == email).first()
#         if user is None:
#             raise HTTPException(status_code=401, detail="User not found")

#         return {"email": user.email}

#     except JWTError:
#         raise HTTPException(status_code=401, detail="Token verification failed")
