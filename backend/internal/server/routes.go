package server

import (
	"net/http"
	"todo-app/backend/internal/task"
)

func RegisterRoutes(repo *task.Repository) {
	handler := task.NewHandler(repo)
	http.HandleFunc("/tasks", WithCORS(handler.HandleTasks))
	http.HandleFunc("/tasks/", WithCORS(handler.HandleTaskByID))
}
