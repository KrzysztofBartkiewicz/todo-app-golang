package auth

import (
	"errors"
	"net/http"
)

type contextKey string

const userIDKey contextKey = "userID"

func GetUserID(r *http.Request) (int, error) {
	userID, ok := r.Context().Value(userIDKey).(int)

	if !ok {
		return 0, errors.New("user ID not found in context")
	}

	return userID, nil
}
