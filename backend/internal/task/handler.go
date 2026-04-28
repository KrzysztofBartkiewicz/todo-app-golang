package task

import (
	"encoding/json"
	"net/http"
	"strconv"
	"strings"
)

func HandleTasks(w http.ResponseWriter, r *http.Request) {
	switch r.Method {
	case http.MethodGet:
		getTasks(w)
	case http.MethodPost:
		createTask(w, r)
	default:
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
	}
}

func HandleTaskByID(w http.ResponseWriter, r *http.Request) {
	switch r.Method {
	case http.MethodDelete:
		deleteTask(w, r)
	case http.MethodPatch:
		updateTask(w, r)
	default:
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
	}
}

func getTasks(w http.ResponseWriter) {
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(GetAll())
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

	createdTask := Create(newTask)

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(createdTask)
}

func deleteTask(w http.ResponseWriter, r *http.Request) {
	id, err := getTaskID(r)
	if err != nil {
		http.Error(w, "Invalid task id", http.StatusBadRequest)
		return
	}

	err = Delete(id)
	if err != nil {
		http.Error(w, "Task not found", http.StatusNotFound)
		return
	}

	w.WriteHeader(http.StatusNoContent)
}

func updateTask(w http.ResponseWriter, r *http.Request) {
	id, err := getTaskID(r)
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

	updatedTask, err := Update(id, req)
	if err != nil {
		http.Error(w, "Task not found", http.StatusNotFound)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(updatedTask)
}

func getTaskID(r *http.Request) (int, error) {
	idStr := strings.TrimPrefix(r.URL.Path, "/tasks/")
	return strconv.Atoi(idStr)
}
