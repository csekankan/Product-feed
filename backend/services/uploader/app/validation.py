from  fastapi import HTTPException

def header_validation(authorization):
        # Validate Bearer Token
        if not authorization.startswith("Bearer "):
            raise HTTPException(status_code=401, detail="Invalid token format")
        token = authorization.split("Bearer ")[1]
        # Create a new task entry in product-management-service
        headers = {"Authorization": f"Bearer {token}"}
        return headers
