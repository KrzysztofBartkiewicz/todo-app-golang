package server

import (
	"net/http"
	"todo-app/backend/internal/auth"
	"todo-app/backend/internal/session"
	"todo-app/backend/internal/task"
	"todo-app/backend/internal/user"
)

func RegisterRoutes(tasksRepo *task.Repository, userRepo *user.Repository, sessionRepo *session.Repository) {
	tasksHandler := task.NewHandler(tasksRepo)
	userHandler := user.NewHandler(userRepo, sessionRepo)
	sessionHandler := session.NewHandler(sessionRepo, userRepo)

	http.Handle("GET /tasks", WithTimeout(WithRequestID(WithLogger(auth.Middleware(tasksHandler.GetTasks)))))
	http.Handle("POST /tasks", WithTimeout(WithRequestID(WithLogger(auth.Middleware(tasksHandler.CreateTask)))))
	http.Handle("PATCH /tasks/{id}", WithTimeout(WithRequestID(WithLogger(auth.Middleware(tasksHandler.UpdateTask)))))
	http.Handle("DELETE /tasks/{id}", WithTimeout(WithRequestID(WithLogger(auth.Middleware(tasksHandler.DeleteTask)))))
	http.Handle("GET /me", WithTimeout(WithRequestID(WithLogger(auth.Middleware(userHandler.GetMe)))))

	http.Handle("POST /register", WithTimeout(WithRequestID(WithLogger(userHandler.Register))))
	http.Handle("POST /login", WithTimeout(WithRequestID(WithLogger(userHandler.Login))))

	http.Handle("POST /refresh", WithTimeout(WithRequestID(WithLogger(sessionHandler.Refresh))))
	http.Handle("POST /logout", WithTimeout(WithRequestID(WithLogger(sessionHandler.Logout))))
}
