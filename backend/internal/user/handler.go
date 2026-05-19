package user

import (
	"database/sql"
	"encoding/json"
	"errors"
	"log"
	"net/http"
	"strings"
	"time"
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

	refreshToken, err := auth.MakeRefreshToken()
	if err != nil {
		response.WriteJSONError(w, http.StatusInternalServerError, "Failed to generate refresh token")
		return
	}

	hashedRefreshToken := auth.HashToken(refreshToken)

	err = h.repo.CreateSession(foundUser.ID, hashedRefreshToken, time.Now().Add(auth.RefreshTokenTTL))
	if err != nil {
		response.WriteJSONError(w, http.StatusInternalServerError, "Failed to create session")
		return
	}

	auth.SetRefreshCookie(w, refreshToken)

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

func (h *Handler) Refresh(w http.ResponseWriter, r *http.Request) {
	cookie, err := r.Cookie("refresh_token")
	if err != nil {
		response.WriteJSONError(w, http.StatusUnauthorized, "Missing refresh token")
		return
	}

	refreshToken := strings.TrimSpace(cookie.Value)
	if refreshToken == "" {
		response.WriteJSONError(w, http.StatusUnauthorized, "Missing refresh token")
		return
	}

	hashedRefreshToken := auth.HashToken(refreshToken)

	session, err := h.repo.FindSessionByRefreshTokenHash(hashedRefreshToken)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			response.WriteJSONError(w, http.StatusUnauthorized, "Invalid refresh token")
			return
		}
		response.WriteJSONError(w, http.StatusInternalServerError, "Failed to look up session")
		return
	}

	if session.RevokedAt != nil {
		response.WriteJSONError(w, http.StatusUnauthorized, "Refresh token revoked")
		return
	}

	if time.Now().After(session.ExpiresAt) {
		response.WriteJSONError(w, http.StatusUnauthorized, "Refresh token expired")
		return
	}

	user, err := h.repo.GetMeByID(session.UserID)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			response.WriteJSONError(w, http.StatusUnauthorized, "Invalid refresh token")
			return
		}
		response.WriteJSONError(w, http.StatusInternalServerError, "Failed to retrieve user")
		return
	}

	token, err := auth.GenerateToken(user.ID, user.Username)
	if err != nil {
		response.WriteJSONError(w, http.StatusInternalServerError, "Failed to generate token")
		return
	}

	response.WriteJSON(w, http.StatusOK, RefreshResponse{
		Token: token,
	})
}

func (h *Handler) Logout(w http.ResponseWriter, r *http.Request) {
	cookie, err := r.Cookie("refresh_token")
	if err != nil || cookie.Value == "" {
		auth.ClearRefreshCookie(w)
		w.WriteHeader(http.StatusNoContent)
		return
	}

	refreshTokenHash := auth.HashToken(cookie.Value)

	rowsAffected, err := h.repo.RevokeSessionByRefreshTokenHash(refreshTokenHash)
	if err != nil {
		response.WriteJSONError(w, http.StatusInternalServerError, "Failed to log out")
		return
	}
	if rowsAffected == 0 {
		log.Println("logout: no active session found for refresh token hash")
	}

	auth.ClearRefreshCookie(w)
	w.WriteHeader(http.StatusNoContent)
}
