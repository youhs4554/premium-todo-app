from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from .models import User
from .schemas import UserCreate

class UserRepository:
    def __init__(self, db: AsyncSession): self.db = db
    async def get_user_by_email(self, email: str):
        res = await self.db.execute(select(User).where(User.email == email))
        return res.scalars().first()
    async def create_user(self, user_data: UserCreate, hashed_password: str):
        db_user = User(email=user_data.email, hashed_password=hashed_password, full_name=user_data.full_name)
        self.db.add(db_user)
        await self.db.commit()
        await self.db.refresh(db_user)
        return db_user