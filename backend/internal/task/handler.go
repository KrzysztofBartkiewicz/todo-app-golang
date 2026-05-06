package task

import (
	"encoding/json"
	"net/http"
	"strconv"
	"strings"
)

type Handler struct {
	repo TaskRepository
}

func NewHandler(repo TaskRepository) *Handler {
	return &Handler{repo: repo}
}

func (h *Handler) HandleTasks(w http.ResponseWriter, r *http.Request) {
	switch r.Method {
	case http.MethodGet:
		h.getTasks(w)
	case http.MethodPost:
		h.createTask(w, r)
	default:
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
	}
}

func (h *Handler) HandleTaskByID(w http.ResponseWriter, r *http.Request) {
	switch r.Method {
	case http.MethodDelete:
		h.deleteTask(w, r)
	case http.MethodPatch:
		h.updateTask(w, r)
	default:
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
	}
}

func (h *Handler) getTasks(w http.ResponseWriter) {
	w.Header().Set("Content-Type", "application/json")
	tasks, err := h.repo.GetAll()
	if err != nil {
		http.Error(w, "Failed to get tasks", http.StatusInternalServerError)
		return
	}
	err = json.NewEncoder(w).Encode(tasks)
	if err != nil {
		http.Error(w, "Failed to encode tasks", http.StatusInternalServerError)
	}
}

func (h *Handler) createTask(w http.ResponseWriter, r *http.Request) {
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

	createdTask, err := h.repo.Create(newTask)
	if err != nil {
		http.Error(w, "Failed to create task", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	err = json.NewEncoder(w).Encode(createdTask)
	if err != nil {
		http.Error(w, "Failed to encode task", http.StatusInternalServerError)
	}
}

func (h *Handler) deleteTask(w http.ResponseWriter, r *http.Request) {
	id, err := getTaskID(r)
	if err != nil {
		http.Error(w, "Invalid task id", http.StatusBadRequest)
		return
	}

	err = h.repo.Delete(id)
	if err != nil {
		http.Error(w, "Task not found", http.StatusNotFound)
		return
	}

	w.WriteHeader(http.StatusNoContent)
}

func (h *Handler) updateTask(w http.ResponseWriter, r *http.Request) {
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

	updatedTask, err := h.repo.Update(id, req)
	if err != nil {
		http.Error(w, "Task not found", http.StatusNotFound)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	err = json.NewEncoder(w).Encode(updatedTask)
	if err != nil {
		http.Error(w, "Failed to encode task", http.StatusInternalServerError)
	}
}

func getTaskID(r *http.Request) (int, error) {
	idStr := strings.TrimPrefix(r.URL.Path, "/tasks/")
	return strconv.Atoi(idStr)
}
