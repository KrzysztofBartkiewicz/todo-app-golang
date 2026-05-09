package auth

import (
	"errors"
	"net/http"
)

func GetUserID(r *http.Request) (int, error) {
	userID, ok := r.Context().Value(UserIDKey).(int)

	if !ok {
		return 0, errors.New("user ID not found in context")
	}

	return userID, nil
}
