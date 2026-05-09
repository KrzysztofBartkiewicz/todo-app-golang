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

	http.HandleFunc("/tasks", WithCORS(auth.Middleware(tasksHandler.HandleTasks)))
	http.HandleFunc("/tasks/", WithCORS(auth.Middleware(tasksHandler.HandleTaskByID)))

	http.HandleFunc("/register", WithCORS(userHandler.Register))
	http.HandleFunc("/login", WithCORS(userHandler.Login))
}
