package user

import (
	"encoding/json"
	"net/http"
	"strings"
	"todo-app/backend/internal/auth"
	"todo-app/backend/internal/response"
)

type Handler struct {
	repo UserRepository
}

func NewHandler(repo UserRepository) *Handler {
	return &Handler{repo: repo}
}

func (h *Handler) Register(w http.ResponseWriter, r *http.Request) {
	var req RegisterRequest

	err := json.NewDecoder(r.Body).Decode(&req)
	if err != nil {
		response.WriteJSONError(w, http.StatusBadRequest, "Invalid request body")
		return
	}

	req.Username = strings.TrimSpace(req.Username)

	if req.Username == "" || req.Password == "" {
		response.WriteJSONError(w, http.StatusBadRequest, "Missing username or password")
		return
	}

	passwordHash, err := HashPassword(req.Password)
	if err != nil {
		response.WriteJSONError(w, http.StatusInternalServerError, "Failed to hash password")
		return
	}

	createdUser, err := h.repo.Create(req.Username, passwordHash)
	if err != nil {
		response.WriteJSONError(w, http.StatusInternalServerError, "Failed to create user")
		return
	}

	response.WriteJSON(w, http.StatusCreated, createdUser)
}

func (h *Handler) Login(w http.ResponseWriter, r *http.Request) {
	var req LoginRequest

	err := json.NewDecoder(r.Body).Decode(&req)
	if err != nil {
		response.WriteJSONError(w, http.StatusBadRequest, "Invalid request body")
		return
	}

	req.Username = strings.TrimSpace(req.Username)

	if req.Username == "" || req.Password == "" {
		response.WriteJSONError(w, http.StatusBadRequest, "Missing username or password")
		return
	}

	foundUser, err := h.repo.FindByUsername(req.Username)
	if err != nil {
		response.WriteJSONError(w, http.StatusUnauthorized, "Invalid username or password")
		return
	}

	if !CheckPasswordHash(req.Password, foundUser.PasswordHash) {
		response.WriteJSONError(w, http.StatusUnauthorized, "Invalid username or password")
		return
	}

	token, err := auth.GenerateToken(foundUser.ID, foundUser.Username)
	if err != nil {
		response.WriteJSONError(w, http.StatusInternalServerError, "Failed to generate token")
		return
	}

	response.WriteJSON(w, http.StatusOK, LoginResponse{
		Token: token,
		User:  foundUser,
	})
}

func (h *Handler) GetMe(w http.ResponseWriter, r *http.Request) {
	userID, err := auth.GetUserID(r)
	if err != nil {
		response.WriteJSONError(w, http.StatusUnauthorized, "Unauthorized")
		return
	}

	user, err := h.repo.GetMeByID(userID)
	if err != nil {
		response.WriteJSONError(w, http.StatusInternalServerError, "Failed to retrieve user")
		return
	}

	response.WriteJSON(w, http.StatusOK, user)
}
