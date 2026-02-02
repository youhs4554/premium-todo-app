from fastapi import APIRouter, Depends
from ..database import get_db
from .schemas import UserCreate, UserLogin, UserResponse, Token
from .repository import UserRepository
from .service import AuthService

router = APIRouter()

async def get_auth_service(db=Depends(get_db)):
    return AuthService(UserRepository(db))

@router.post("/register", response_model=UserResponse)
async def register(user_data: UserCreate, service=Depends(get_auth_service)):
    return await service.register(user_data)

@router.post("/login", response_model=Token)
async def login(login_data: UserLogin, service=Depends(get_auth_service)):
    return await service.login(login_data)