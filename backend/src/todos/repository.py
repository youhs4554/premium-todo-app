from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from .models import Todo
from .schemas import TodoCreate, TodoUpdate
from typing import List

class TodoRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_all_by_user(self, user_id: int) -> List[Todo]:
        result = await self.db.execute(select(Todo).where(Todo.user_id == user_id))
        return result.scalars().all()

    async def get_by_id(self, todo_id: int, user_id: int) -> Todo:
        result = await self.db.execute(
            select(Todo).where(Todo.id == todo_id, Todo.user_id == user_id)
        )
        return result.scalars().first()

    async def create(self, todo_data: TodoCreate, user_id: int) -> Todo:
        db_todo = Todo(**todo_data.dict(), user_id=user_id)
        self.db.add(db_todo)
        await self.db.commit()
        await self.db.refresh(db_todo)
        return db_todo

    async def update(self, todo_id: int, todo_data: TodoUpdate, user_id: int) -> Todo:
        db_todo = await self.get_by_id(todo_id, user_id)
        if not db_todo:
            return None
        
        update_data = todo_data.dict(exclude_unset=True)
        for key, value in update_data.items():
            setattr(db_todo, key, value)
        
        await self.db.commit()
        await self.db.refresh(db_todo)
        return db_todo

    async def delete(self, todo_id: int, user_id: int) -> bool:
        db_todo = await self.get_by_id(todo_id, user_id)
        if not db_todo:
            return False
        
        await self.db.delete(db_todo)
        await self.db.commit()
        return True
