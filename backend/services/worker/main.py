from fastapi import FastAPI

from  app.consumer import start_worker
# FastAPI app instance
app = FastAPI()
print("starting worker")

# Call the start_worker function to launch the worker when the FastAPI service starts
@app.on_event("startup")
def startup_event():
    start_worker()

# Example FastAPI route for health check
@app.get("/health")
def read_health():
    return {"status": "OK"}
