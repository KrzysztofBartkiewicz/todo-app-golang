package user

import (
	"database/sql"
	"encoding/json"
	"errors"
	"net/http"
	"strings"
	"time"
	"todo-app/backend/internal/auth"
	"todo-app/backend/internal/response"
)

type SessionCreator interface {
	CreateSession(userID int, refreshTokenHash string, expiresAt time.Time) error
}

type Handler struct {
	repo           UserRepository
	sessionCreator SessionCreator
}

func NewHandler(repo UserRepository, sessionCreator SessionCreator) *Handler {
	return &Handler{repo: repo, sessionCreator: sessionCreator}
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

	// TODO: enforce stronger password requirements (min 8 chars, at least 1 uppercase, 1 lowercase, 1 number, 1 special char)
	if len(req.Password) < 4 || len(req.Password) > 70 {
		response.WriteJSONError(w, http.StatusBadRequest, "Password must be between 4 and 70 characters")
		return
	}

	passwordHash, err := HashPassword(req.Password)
	if err != nil {
		response.WriteJSONError(w, http.StatusInternalServerError, "Failed to hash password")
		return
	}

	createdUser, err := h.repo.Create(req.Username, passwordHash)
	if err != nil {
		if errors.Is(err, ErrUsernameExists) {
			response.WriteJSONError(w, http.StatusConflict, "Username already exists")
			return
		}
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
		if errors.Is(err, sql.ErrNoRows) {
			response.WriteJSONError(w, http.StatusUnauthorized, "Invalid username or password")
			return
		}
		response.WriteJSONError(w, http.StatusInternalServerError, "Failed to look up user")
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

	refreshToken, err := auth.MakeRefreshToken()
	if err != nil {
		response.WriteJSONError(w, http.StatusInternalServerError, "Failed to generate refresh token")
		return
	}

	hashedRefreshToken := auth.HashToken(refreshToken)

	err = h.sessionCreator.CreateSession(foundUser.ID, hashedRefreshToken, time.Now().Add(auth.RefreshTokenTTL))
	if err != nil {
		response.WriteJSONError(w, http.StatusInternalServerError, "Failed to create session")
		return
	}

	auth.SetRefreshCookie(w, refreshToken)

	response.WriteJSON(w, http.StatusOK, LoginResponse{
		Token: token,
		User: User{
			ID:       foundUser.ID,
			Username: foundUser.Username,
		},
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
