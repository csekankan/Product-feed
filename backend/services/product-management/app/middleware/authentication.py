from fastapi import Depends, Request, HTTPException, Header
from app.auth.jwt import verify_access_token
from app.config.db import get_db
from app.model.user import User
from sqlalchemy.orm import Session

async def verify_auth(
    authorization: str = Header(None),
    db: Session = Depends(get_db)
):
    """
    Dependency function to verify JWT token.
    This is used for specific protected routes.
    """
    if not authorization:
        raise HTTPException(status_code=401, detail="Authorization header missing")

    try:
        token = authorization.split(" ")[1]  # Extract token from 'Bearer <TOKEN>'
        payload = verify_access_token(token)
        email = payload.get("sub")

        if not email:
            raise HTTPException(status_code=401, detail="Invalid token")

        user = db.query(User).filter(User.email == email).first()
        if not user:
            raise HTTPException(status_code=401, detail="User not found")

        return  user 
    except Exception as e:
        raise HTTPException(status_code=401, detail=str(e))
