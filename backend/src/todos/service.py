from fastapi import HTTPException, status
from .repository import TodoRepository
from .schemas import TodoCreate, TodoUpdate
from typing import List

class TodoService:
    def __init__(self, repository: TodoRepository):
        self.repository = repository

    async def list_todos(self, user_id: int) -> List:
        return await self.repository.get_all_by_user(user_id)

    async def get_todo(self, todo_id: int, user_id: int):
        todo = await self.repository.get_by_id(todo_id, user_id)
        if not todo:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Todo not found")
        return todo

    async def create_todo(self, todo_data: TodoCreate, user_id: int):
        return await self.repository.create(todo_data, user_id)

    async def update_todo(self, todo_id: int, todo_data: TodoUpdate, user_id: int):
        todo = await self.repository.update(todo_id, todo_data, user_id)
        if not todo:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Todo not found")
        return todo

    async def delete_todo(self, todo_id: int, user_id: int):
        success = await self.repository.delete(todo_id, user_id)
        if not success:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Todo not found")
        return {"message": "Todo deleted successfully"}
