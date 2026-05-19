package server

import (
	"net/http"
	"todo-app/backend/internal/auth"
	"todo-app/backend/internal/task"
	"todo-app/backend/internal/user"
)

func RegisterRoutes(tasksRepo *task.Repository, userRepo *user.Repository) {
	tasksHandler := task.NewHandler(tasksRepo)
	userHandler := user.NewHandler(userRepo)

	http.Handle("GET /tasks", WithTimeout(WithRequestID(WithLogger(WithCORS(auth.Middleware(tasksHandler.GetTasks))))))
	http.Handle("POST /tasks", WithTimeout(WithRequestID(WithLogger(WithCORS(auth.Middleware(tasksHandler.CreateTask))))))
	http.Handle("PATCH /tasks/{id}", WithTimeout(WithRequestID(WithLogger(WithCORS(auth.Middleware(tasksHandler.UpdateTask))))))
	http.Handle("DELETE /tasks/{id}", WithTimeout(WithRequestID(WithLogger(WithCORS(auth.Middleware(tasksHandler.DeleteTask))))))
	http.Handle("GET /me", WithTimeout(WithRequestID(WithLogger(WithCORS(auth.Middleware(userHandler.GetMe))))))

	http.Handle("POST /register", WithTimeout(WithRequestID(WithLogger(WithCORS(userHandler.Register)))))
	http.Handle("POST /login", WithTimeout(WithRequestID(WithLogger(WithCORS(userHandler.Login)))))
	http.Handle("POST /refresh", WithTimeout(WithRequestID(WithLogger(WithCORS(userHandler.Refresh)))))
	http.Handle("POST /logout", WithTimeout(WithRequestID(WithLogger(WithCORS(userHandler.Logout)))))
}
