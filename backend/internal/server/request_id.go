package server

import (
	"context"
	"net/http"
	"strconv"
	"time"
)

type requestIDKey string

const RequestIDKey requestIDKey = "requestID"

func NewRequestID() string {
	return strconv.FormatInt(time.Now().UnixNano(), 10)
}

func WithRequestID(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		requestID := NewRequestID()

		ctx := context.WithValue(r.Context(), RequestIDKey, requestID)
		next(w, r.WithContext(ctx))
	}
}

func GetRequestID(r *http.Request) string {
	value := r.Context().Value(RequestIDKey)

	requestID, ok := value.(string)

	if !ok {
		return ""
	}

	return requestID
}
