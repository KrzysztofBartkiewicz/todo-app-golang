package main

import (
	"encoding/json"
	"net/http"
	"todo-app/backend/utils"
)

type Task struct {
	ID     int    `json:"id"`
	Title  string `json:"title"`
	Status string `json:"status"`
}

var tasks = []Task{
	{ID: 1, Title: "Task 1", Status: "pending"},
	{ID: 2, Title: "Task 2", Status: "completed"},
}

func withCORS(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "http://localhost:5173")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusNoContent)
			return
		}

		next(w, r)
	}
}

func main() {
	http.HandleFunc("/health", withCORS(healthHandler))

	http.HandleFunc("/tasks", withCORS(handleTasks))
	http.HandleFunc("/tasks/", withCORS(handleTaskByID))

	err := http.ListenAndServe(":8080", nil)

	if err != nil {
		panic(err)
	}
}

func handleTaskByID(w http.ResponseWriter, r *http.Request) {
	switch r.Method {
	case http.MethodDelete:
		deleteTask(w, r)
	case http.MethodPatch:
		updateTask(w, r)
	default:
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
	}
}

func handleTasks(w http.ResponseWriter, r *http.Request) {
	switch r.Method {
	case http.MethodGet:
		getTasks(w)
	case http.MethodPost:
		createTask(w, r)
	default:
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
	}

}

func healthHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	err := json.NewEncoder(w).Encode(map[string]string{
		"status": "ok",
	})
	if err != nil {
		http.Error(w, "Failed to encode response", http.StatusInternalServerError)
	}
}

func getTasks(w http.ResponseWriter) {
	w.Header().Set("Content-Type", "application/json")
	err := json.NewEncoder(w).Encode(tasks)
	if err != nil {
		http.Error(w, "Failed to encode response", http.StatusInternalServerError)
	}
}

func createTask(w http.ResponseWriter, r *http.Request) {
	var newTask Task

	err := json.NewDecoder(r.Body).Decode(&newTask)
	if err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	if newTask.Title == "" {
		http.Error(w, "Missing title", http.StatusBadRequest)
		return
	}

	if newTask.Status == "" {
		newTask.Status = "todo"
	}

	newTask.ID = len(tasks) + 1
	tasks = append(tasks, newTask)

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)

	err = json.NewEncoder(w).Encode(newTask)
	if err != nil {
		http.Error(w, "Failed to encode response", http.StatusInternalServerError)
		return
	}
}

func deleteTask(w http.ResponseWriter, r *http.Request) {
	id, err := utils.GetTaskID(r)
	if err != nil {
		http.Error(w, "Invalid task id", http.StatusBadRequest)
		return
	}

	for i, task := range tasks {
		if task.ID == id {
			tasks = append(tasks[:i], tasks[i+1:]...)
			w.WriteHeader(http.StatusNoContent)
			return
		}
	}
	http.Error(w, "Task not found", http.StatusNotFound)
}

type UpdateTaskRequest struct {
	Title  *string `json:"title"`
	Status *string `json:"status"`
}

func updateTask(w http.ResponseWriter, r *http.Request) {
	id, err := utils.GetTaskID(r)
	if err != nil {
		http.Error(w, "Invalid task id", http.StatusBadRequest)
		return
	}

	var req UpdateTaskRequest

	err = json.NewDecoder(r.Body).Decode(&req)
	if err != nil {
		http.Error(w, "Invalid JSON body", http.StatusBadRequest)
		return
	}

	for i, task := range tasks {
		if task.ID == id {
			if req.Title != nil {
				tasks[i].Title = *req.Title
			}

			if req.Status != nil {
				tasks[i].Status = *req.Status
			}

			w.Header().Set("Content-Type", "application/json")
			err := json.NewEncoder(w).Encode(tasks[i])
			if err != nil {
				http.Error(w, "Failed to encode response", http.StatusInternalServerError)
			}
			return
		}
	}

	http.Error(w, "Task not found", http.StatusNotFound)
}
