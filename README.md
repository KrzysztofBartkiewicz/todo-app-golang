# Todo App

A full-stack todo application with user authentication and task management.

## Tech Stack

**Backend** — Go, SQLite, JWT authentication

**Frontend** — React, TypeScript, Material UI, Vite

## Project Structure

```
todo-app/
├── backend/    # Go REST API
└── frontend/   # React SPA
```

## Getting Started

### Backend

```bash
cd backend
cp .env.example .env   # configure environment variables
go run cmd/main.go
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

## Features

- User registration and login
- JWT-based authentication with session management
- Create, update, and delete tasks
- Task status tracking (todo, in progress, done)
