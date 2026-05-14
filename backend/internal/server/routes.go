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

	http.HandleFunc("/tasks", WithLogger(WithCORS(auth.Middleware(tasksHandler.HandleTasks))))
	http.HandleFunc("/tasks/", WithLogger(WithCORS(auth.Middleware(tasksHandler.HandleTaskByID))))

	http.HandleFunc("/register", WithLogger(WithCORS(userHandler.Register)))
	http.HandleFunc("/login", WithLogger(WithCORS(userHandler.Login)))
}
