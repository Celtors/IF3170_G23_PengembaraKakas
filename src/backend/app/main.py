from fastapi import FastAPI

app = FastAPI(
    title="Tubes AI Pengembara Kakas",
    version="1.0.0"
)


@app.get("/")
def root():
    return {
        "message": "Truck Loading Optimizer API"
    }


@app.get("/health")
def health():
    return {
        "status": "ok"
    }