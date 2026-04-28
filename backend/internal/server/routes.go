package server

import (
	"net/http"
	"todo-app/backend/internal/task"
)

func RegisterRoutes() {
	http.HandleFunc("/tasks", WithCORS(task.HandleTasks))
	http.HandleFunc("/tasks/", WithCORS(task.HandleTaskByID))
}
