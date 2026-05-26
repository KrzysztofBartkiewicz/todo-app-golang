package session

import (
	"database/sql"
	"errors"
	"log"
	"net/http"
	"strings"
	"time"
	"todo-app/backend/internal/auth"
	"todo-app/backend/internal/response"
	"todo-app/backend/internal/user"
)

type Handler struct {
	repo     SessionRepository
	userRepo user.UserRepository
}

func NewHandler(repo SessionRepository, userRepo user.UserRepository) *Handler {
	return &Handler{repo: repo, userRepo: userRepo}
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

	hashedRefreshToken := hashToken(refreshToken)

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

	user, err := h.userRepo.FindByID(session.UserID)
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

	newRefreshToken, expiresAt, err := h.repo.RotateSession(hashedRefreshToken, user.ID)
	if err != nil {
		response.WriteJSONError(w, http.StatusInternalServerError, "Failed to generate refresh token")
		return
	}

	auth.SetRefreshCookie(w, newRefreshToken, expiresAt)

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

	refreshTokenHash := hashToken(cookie.Value)

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
