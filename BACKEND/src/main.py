try:
    from .database import Base, engine
    from .routers import auth, owner
except ImportError:  # pragma: no cover - allows running as a script from src/
    from database import Base, engine
    from routers import auth, owner

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Automatically sync/create all 9 tables in PostgreSQL
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Salon SaaS & Marketplace Core API", version="2.5.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(owner.router)


@app.get("/")
def health_check():
    return {"status": "Salon Core API is healthy & connected", "docs": "/docs"}
