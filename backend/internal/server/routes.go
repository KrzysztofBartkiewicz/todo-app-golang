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

	http.Handle("/tasks", WithTimeout(WithLogger(WithCORS(auth.Middleware(tasksHandler.HandleTasks)))))
	http.Handle("/tasks/", WithTimeout(WithLogger(WithCORS(auth.Middleware(tasksHandler.HandleTaskByID)))))

	http.Handle("/register", WithTimeout(WithLogger(WithCORS(userHandler.Register))))
	http.Handle("/login", WithTimeout(WithLogger(WithCORS(userHandler.Login))))
}
