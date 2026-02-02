from fastapi import HTTPException, status
from .schemas import UserCreate, UserLogin
from .utils import get_password_hash, verify_password, create_access_token

class AuthService:
    def __init__(self, repository): self.repository = repository
    async def register(self, user_data: UserCreate):
        if await self.repository.get_user_by_email(user_data.email):
            raise HTTPException(status_code=400, detail="Email exists")
        hashed = get_password_hash(user_data.password)
        return await self.repository.create_user(user_data, hashed)
    async def login(self, login_data: UserLogin):
        user = await self.repository.get_user_by_email(login_data.email)
        if not user or not verify_password(login_data.password, user.hashed_password):
            raise HTTPException(status_code=401, detail="Invalid credentials")
        return {"access_token": create_access_token({"sub": user.email}), "token_type": "bearer"}