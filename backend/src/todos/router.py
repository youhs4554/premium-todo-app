from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List
from ..database import get_db
from ..auth.dependencies import get_current_user
from ..auth.models import User
from .schemas import TodoCreate, TodoUpdate, TodoResponse
from .repository import TodoRepository
from .service import TodoService

router = APIRouter()

async def get_todo_service(db: AsyncSession = Depends(get_db)) -> TodoService:
    repository = TodoRepository(db)
    return TodoService(repository)

@router.get("/", response_model=List[TodoResponse])
async def list_todos(
    current_user: User = Depends(get_current_user),
    service: TodoService = Depends(get_todo_service)
):
    return await service.list_todos(current_user.id)

@router.post("/", response_model=TodoResponse, status_code=status.HTTP_201_CREATED)
async def create_todo(
    todo_data: TodoCreate,
    current_user: User = Depends(get_current_user),
    service: TodoService = Depends(get_todo_service)
):
    return await service.create_todo(todo_data, current_user.id)

@router.get("/{todo_id}", response_model=TodoResponse)
async def get_todo(
    todo_id: int,
    current_user: User = Depends(get_current_user),
    service: TodoService = Depends(get_todo_service)
):
    return await service.get_todo(todo_id, current_user.id)

@router.put("/{todo_id}", response_model=TodoResponse)
async def update_todo(
    todo_id: int,
    todo_data: TodoUpdate,
    current_user: User = Depends(get_current_user),
    service: TodoService = Depends(get_todo_service)
):
    return await service.update_todo(todo_id, todo_data, current_user.id)

@router.delete("/{todo_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_todo(
    todo_id: int,
    current_user: User = Depends(get_current_user),
    service: TodoService = Depends(get_todo_service)
):
    return await service.delete_todo(todo_id, current_user.id)
