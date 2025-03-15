from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.config.db import get_db
from app.model.products import Product
from pydantic import BaseModel
from typing import List, Optional
from app.schema.product import ProductCreate,ProductUpdate
from app.middleware.authentication import verify_auth

product_router = APIRouter(prefix="/products", tags=["Products"])

# # Batch Insert
# @product_router.post("/batch", status_code=201)
# def batch_insert(products: List[ProductCreate], db: Session = Depends(get_db)):
#     """ Insert multiple products at once """
#     try:
#         new_products = [Product(**product.dict()) for product in products]
#         db.add_all(new_products)
#         db.commit()
#         return {"message": "Batch insert successful", "inserted_count": len(new_products)}
#     except Exception as e:
#         # Catch any other exception and rollback
#         db.rollback()
#         raise HTTPException(status_code=500, detail=f"An unexpected error occurred: {str(e)}")


#  Single Product Update
@product_router.put("/{id}")
def update_product(id: int, product_update: ProductUpdate,user = Depends(verify_auth), db: Session = Depends(get_db)):
    """ Update product details by ID """
    try:
        product = db.query(Product).filter(Product.id == id).first()
        if not product:
            raise HTTPException(status_code=404, detail="Product not found")

        # Update fields
        if product_update.product_name:
            product.product_name = product_update.product_name
        product.price = product_update.price

        db.commit()
        return {"message": "Product updated", "product_id": id}
    except Exception as e:
        # Catch any other exception and rollback
        db.rollback()
        raise HTTPException(status_code=500, detail=f"An unexpected error occurred: {str(e)}")

# Cursor-Based Pagination with Price Range and Product Name Filter
@product_router.get("")
def get_products(
    db: Session = Depends(get_db),
    user=Depends(verify_auth),
    cursor: Optional[int] = Query(None, description="Last ID from previous page"),
    limit: int = Query(10, description="Rows per page (default: 10)"),
    minPrice: Optional[float] = Query(None, description="Minimum price filter"),
    maxPrice: Optional[float] = Query(None, description="Maximum price filter"),
    product_name: Optional[str] = Query(None, description="Filter by product name"),
):
    """Fetch products with cursor-based pagination and optional filters"""

    # Base query ordered by ID descending for efficiency
    query = db.query(Product).order_by(Product.id.desc())

    # Apply cursor-based pagination
    if cursor:
        query = query.filter(Product.id < cursor)  # Fetch products with ID less than cursor for descending order

    # Apply price range filter if provided
    if minPrice is not None and maxPrice is not None:
        query = query.filter(Product.price.between(minPrice, maxPrice))
    elif minPrice is not None:
        query = query.filter(Product.price >= minPrice)
    elif maxPrice is not None:
        query = query.filter(Product.price <= maxPrice)

    # Apply product name filter if provided (case-insensitive match)
    if product_name:
        query = query.filter(func.lower(Product.product_name).contains(product_name.lower()))

    # Fetch one extra row to check if there's a next page
    products = query.limit(limit + 1).all()

    # Determine if there's a next page
    has_next = len(products) > limit
    next_cursor = products[-1].id if has_next else None

    return {
        "products": [
            {
                "id": p.id,
                "store_id": p.store_id,
                "sku": p.sku,
                "product_name": p.product_name,
                "price": p.price,
                "date": p.date,
            }
            for p in products[:limit]  # Return only the requested limit
        ],
        "next_cursor": next_cursor,
        "has_next": has_next,
    }
