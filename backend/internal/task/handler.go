package task

import (
	"encoding/json"
	"errors"
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
		writeJSONError(w, http.StatusMethodNotAllowed, "Method not allowed")
	}
}

func (h *Handler) HandleTaskByID(w http.ResponseWriter, r *http.Request) {
	switch r.Method {
	case http.MethodDelete:
		h.deleteTask(w, r)
	case http.MethodPatch:
		h.updateTask(w, r)
	default:
		writeJSONError(w, http.StatusMethodNotAllowed, "Method not allowed")
	}
}

func (h *Handler) getTasks(w http.ResponseWriter) {
	tasks, err := h.repo.GetAll()
	if err != nil {
		writeJSONError(w, http.StatusInternalServerError, "Failed to fetch tasks")
		return
	}

	writeJSON(w, http.StatusOK, tasks)
}

func (h *Handler) createTask(w http.ResponseWriter, r *http.Request) {
	var newTask Task

	decoder := json.NewDecoder(r.Body)
	decoder.DisallowUnknownFields()

	err := decoder.Decode(&newTask)

	if err != nil {
		writeJSONError(w, http.StatusBadRequest, "Invalid request body")
		return
	}

	newTask.Title = strings.TrimSpace(newTask.Title)

	if newTask.Title == "" {
		writeJSONError(w, http.StatusBadRequest, "Missing title")
		return
	}

	if !isValidStatus(newTask.Status) && newTask.Status != "" {
		writeJSONError(w, http.StatusBadRequest, "Invalid status")
		return
	}

	createdTask, err := h.repo.Create(newTask)
	if err != nil {
		writeJSONError(w, http.StatusInternalServerError, "Failed to create task")
		return
	}

	writeJSON(w, http.StatusCreated, createdTask)
}

func (h *Handler) deleteTask(w http.ResponseWriter, r *http.Request) {
	id, err := getTaskID(r)
	if err != nil {
		writeJSONError(w, http.StatusBadRequest, "Invalid task id")
		return
	}

	err = h.repo.Delete(id)
	if err != nil {
		if errors.Is(err, ErrTaskNotFound) {
			writeJSONError(w, http.StatusNotFound, "Task not found")
			return
		}
		writeJSONError(w, http.StatusInternalServerError, "Failed to delete task")
		return
	}

	writeNoContent(w)
}

func (h *Handler) updateTask(w http.ResponseWriter, r *http.Request) {
	id, err := getTaskID(r)
	if err != nil {
		writeJSONError(w, http.StatusBadRequest, "Invalid task id")
		return
	}

	var req UpdateTaskRequest

	decoder := json.NewDecoder(r.Body)
	decoder.DisallowUnknownFields()

	err = decoder.Decode(&req)

	if err != nil {
		writeJSONError(w, http.StatusBadRequest, "Invalid JSON body")
		return
	}

	if req.Title == nil && req.Status == nil {
		writeJSONError(w, http.StatusBadRequest, "No fields to update")
		return
	}

	if req.Status != nil && !isValidStatus(*req.Status) {
		writeJSONError(w, http.StatusBadRequest, "Invalid status")
		return
	}

	if req.Title != nil {
		*req.Title = strings.TrimSpace(*req.Title)

		if *req.Title == "" {
			writeJSONError(w, http.StatusBadRequest, "Missing title")
			return
		}
	}

	updatedTask, err := h.repo.Update(id, req)
	if err != nil {
		if errors.Is(err, ErrTaskNotFound) {
			writeJSONError(w, http.StatusNotFound, "Task not found")
			return
		}

		writeJSONError(w, http.StatusInternalServerError, "Failed to update task")
		return
	}

	writeJSON(w, http.StatusOK, updatedTask)
}

func getTaskID(r *http.Request) (int, error) {
	idStr := strings.TrimPrefix(r.URL.Path, "/tasks/")
	return strconv.Atoi(idStr)
}
