package task

import (
	"encoding/json"
	"errors"
	"net/http"
	"strconv"
	"strings"
	"todo-app/backend/internal/auth"
	"todo-app/backend/internal/response"
)

type Handler struct {
	repo TaskRepository
}

func NewHandler(repo TaskRepository) *Handler {
	return &Handler{repo: repo}
}

func (h *Handler) GetTasks(w http.ResponseWriter, r *http.Request) {
	userID, err := auth.GetUserID(r)

	if err != nil {
		response.WriteJSONError(w, http.StatusUnauthorized, "Unauthorized")
		return
	}

	tasks, err := h.repo.GetAllByUserID(userID)
	if err != nil {
		response.WriteJSONError(w, http.StatusInternalServerError, "Failed to fetch tasks")
		return
	}

	response.WriteJSON(w, http.StatusOK, tasks)
}

func (h *Handler) CreateTask(w http.ResponseWriter, r *http.Request) {
	var req CreateTaskRequest

	decoder := json.NewDecoder(r.Body)
	decoder.DisallowUnknownFields()

	err := decoder.Decode(&req)

	if err != nil {
		response.WriteJSONError(w, http.StatusBadRequest, "Invalid request body")
		return
	}

	req.Title = strings.TrimSpace(req.Title)

	if req.Title == "" {
		response.WriteJSONError(w, http.StatusBadRequest, "Missing title")
		return
	}

	if !isValidStatus(req.Status) && req.Status != "" {
		response.WriteJSONError(w, http.StatusBadRequest, "Invalid status")
		return
	}

	userID, err := auth.GetUserID(r)
	if err != nil {
		response.WriteJSONError(w, http.StatusUnauthorized, "Unauthorized")
		return
	}

	newTask := Task{
		Title:  req.Title,
		Status: req.Status,
		UserID: userID,
	}

	createdTask, err := h.repo.CreateByUserID(newTask, userID)
	if err != nil {
		response.WriteJSONError(w, http.StatusInternalServerError, "Failed to create task")
		return
	}

	response.WriteJSON(w, http.StatusCreated, createdTask)
}

func (h *Handler) DeleteTask(w http.ResponseWriter, r *http.Request) {
	id, err := strconv.Atoi(r.PathValue("id"))
	if err != nil {
		response.WriteJSONError(w, http.StatusBadRequest, "Invalid task id")
		return
	}

	userID, err := auth.GetUserID(r)
	if err != nil {
		response.WriteJSONError(w, http.StatusUnauthorized, "Unauthorized")
		return
	}

	err = h.repo.DeleteByIDAndUserID(id, userID)
	if err != nil {
		if errors.Is(err, ErrTaskNotFound) {
			response.WriteJSONError(w, http.StatusNotFound, "Task not found")
			return
		}
		response.WriteJSONError(w, http.StatusInternalServerError, "Failed to delete task")
		return
	}

	response.WriteNoContent(w)
}

func (h *Handler) UpdateTask(w http.ResponseWriter, r *http.Request) {
	id, err := strconv.Atoi(r.PathValue("id"))
	if err != nil {
		response.WriteJSONError(w, http.StatusBadRequest, "Invalid task id")
		return
	}

	var req UpdateTaskRequest

	decoder := json.NewDecoder(r.Body)
	decoder.DisallowUnknownFields()

	err = decoder.Decode(&req)

	if err != nil {
		response.WriteJSONError(w, http.StatusBadRequest, "Invalid JSON body")
		return
	}

	if req.Title == nil && req.Status == nil {
		response.WriteJSONError(w, http.StatusBadRequest, "No fields to update")
		return
	}

	if req.Status != nil && !isValidStatus(*req.Status) {
		response.WriteJSONError(w, http.StatusBadRequest, "Invalid status")
		return
	}

	if req.Title != nil {
		*req.Title = strings.TrimSpace(*req.Title)

		if *req.Title == "" {
			response.WriteJSONError(w, http.StatusBadRequest, "Missing title")
			return
		}
	}

	userID, err := auth.GetUserID(r)
	if err != nil {
		response.WriteJSONError(w, http.StatusUnauthorized, "Unauthorized")
		return
	}

	updatedTask, err := h.repo.UpdateByTaskIDAndUserID(id, userID, req)
	if err != nil {
		if errors.Is(err, ErrTaskNotFound) {
			response.WriteJSONError(w, http.StatusNotFound, "Task not found")
			return
		}

		response.WriteJSONError(w, http.StatusInternalServerError, "Failed to update task")
		return
	}

	response.WriteJSON(w, http.StatusOK, updatedTask)
}

