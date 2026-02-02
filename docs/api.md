# API Documentation

The TODO App Backend is built with FastAPI and follows RESTful principles.

**Base URL**: `http://localhost:8000/api`

## 🔐 Authentication

### Registration
- **URL**: `/auth/register`
- **Method**: `POST`
- **Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "securepassword",
    "full_name": "John Doe"
  }
  ```

### Login
- **URL**: `/auth/login`
- **Method**: `POST`
- **Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "securepassword"
  }
  ```
- **Response**:
  ```json
  {
    "access_token": "eyJhbG..",
    "token_type": "bearer"
  }
  ```

## ✅ Tasks (Todos)

*Most endpoints require an `Authorization: Bearer <token>` header.*

### List Tasks
- **URL**: `/todos`
- **Method**: `GET`

### Create Task
- **URL**: `/todos`
- **Method**: `POST`
- **Body**:
  ```json
  {
    "title": "Buy Milk",
    "description": "2% fat, organic"
  }
  ```

### Update Task
- **URL**: `/todos/{id}`
- **Method**: `PUT`
- **Body**: Any subset of `title`, `description`, `completed`.

### Delete Task
- **URL**: `/todos/{id}`
- **Method**: `DELETE`
