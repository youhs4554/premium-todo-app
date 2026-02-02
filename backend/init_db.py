import asyncio
from src.database import engine, Base
from src.auth.models import User
from src.todos.models import Todo

async def init_db():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)
        await conn.run_sync(Base.metadata.create_all)
    print("Database initialized")

if __name__ == "__main__":
    asyncio.run(init_db())
