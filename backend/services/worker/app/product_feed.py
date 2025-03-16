from app.config import RABBITMQ_URL, DIR
import os
import pandas as pd
from fastapi import HTTPException
from app.db import SessionLocal
from app.model.products import Product
from app.model.tasks import Task
from app.model.tasks import StatusTypes
from app.model.error_records import ErrorRecord  # New table for error logging
from datetime import datetime
from sqlalchemy.dialects.postgresql import insert

def process_csv_with_pandas(task_id: str):
    file_name = f"{task_id}.csv"
    file_path = os.path.join(DIR, file_name)

    try:
        if not os.path.exists(file_path):
            raise HTTPException(status_code=404, detail="File not found.")

        # Load CSV with Pandas
        df = pd.read_csv(file_path)
        print(f"Loaded {len(df)} rows from {file_name}")

        # Process records in batches of 100
        batch_size = 100
        db = SessionLocal()
        task = db.query(Task).filter(Task.id == task_id).with_for_update().first()

        try:
            # Lock the task row for update to avoid race conditions
            if not task:
                raise HTTPException(status_code=404, detail="Task not found")

            for start in range(0, len(df), batch_size):
                batch = df.iloc[start:start + batch_size]
                products = [

                    Product(
                        store_id=row['Store ID'],
                        sku_id=row['SKU'],
                        product_name=row['Product Name'],
                        price=row['Price'],
                        date=datetime.utcnow() if pd.isna(row.get('Date')) else row['Date'] 

                    ) 
                    for _, row in batch.iterrows()
                    ]

                db.add_all(products)
            db.commit()
            task.status_id = StatusTypes["COMPLETED"]
            db.commit()

            print(f"Successfully inserted {len(df)} products.")

        except Exception as e:
            db.rollback()
            task.status_id = StatusTypes["FAILED"]
            db.commit()
            print(f"Error inserting products: {e}")
            raise HTTPException(status_code=500, detail=f"Failed to process CSV file.Database Error{e}")

        finally:
            db.close()

    except Exception as e:
        print(f"Error processing CSV with Pandas: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to process CSV file. {e}")


    finally:
        # **Delete the file after processing**
        try:
            if os.path.exists(file_path):
                os.remove(file_path)
                print(f"Deleted file: {file_path}")
        except Exception as e:
            print(f"Error deleting file {file_path}: {e}")
