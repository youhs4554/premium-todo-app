from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .auth.router import router as auth_router
from .todos.router import router as todos_router
from .database import engine, Base
from .auth.models import User
from .todos.models import Todo

app = FastAPI(title="Premium TODO API")

# Configure CORS - More explicit for stability
origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Keeping * but ensuring it's properly handled
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

app.include_router(auth_router, prefix="/api/auth", tags=["auth"])
app.include_router(todos_router, prefix="/api/todos", tags=["todos"])

@app.get("/")
async def root():
    return {"message": "Welcome to the Premium TODO API"}
