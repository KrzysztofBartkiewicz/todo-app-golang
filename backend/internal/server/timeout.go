package server

import (
	"net/http"
	"time"
)

func WithTimeout(next http.HandlerFunc) http.Handler {
	return http.TimeoutHandler(next, 5*time.Second, "Request timed out")
}
