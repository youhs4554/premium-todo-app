# Premium TODO App

A full-stack, secure, and visually stunning TODO application built with FastAPI and Next.js.

## ✨ Features

- **Intuitive UI**: Dark-themed glassmorphism design with smooth animations.
- **Secure Auth**: JWT-based authentication with bcrypt password hashing.
- **Task Management**: Create, update, and delete tasks with detailed descriptions.
- **Progress Dashboard**: Visual statistics showing completion count and progress percentage.
- **Responsive Design**: Optimized for both desktop and mobile devices.

## 🚀 Quick Start

### Prerequisites

- Python 3.10+
- Node.js 18+
- npm or yarn

### 1. Backend Setup

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python init_db.py         # Initialize the SQLite database
uvicorn src.main:app --port 8000
```

### 2. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The application will be available at `http://localhost:3000`.

## 🛠️ Technology Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend** | Next.js 15, Tailwind CSS, Framer Motion, Axios |
| **Backend** | FastAPI, SQLAlchemy (Async), Pydantic |
| **Database** | SQLite (via aiosqlite) |
| **Auth** | JWT, Bcrypt |

## 📖 Documentation

Detailed documentation can be found in the `docs/` folder:
- [API Reference](./docs/api.md)
- [Frontend Architecture](./docs/frontend.md)
- [Database Schema](./docs/database.md)

## 📄 License

MIT License
