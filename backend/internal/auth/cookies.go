package auth

import (
	"net/http"
	"os"
	"time"
)

func ClearRefreshCookie(w http.ResponseWriter) {
	http.SetCookie(w, &http.Cookie{
		Name:     "refresh_token",
		Value:    "",
		Path:     "/",
		HttpOnly: true,
		SameSite: http.SameSiteLaxMode,
		Secure:   isProduction(),
		MaxAge:   -1,
	})
}

func SetRefreshCookie(w http.ResponseWriter, token string, expiresAt time.Time) {
	http.SetCookie(w, &http.Cookie{
		Name:     "refresh_token",
		Value:    token,
		Path:     "/",
		HttpOnly: true,
		SameSite: http.SameSiteLaxMode,
		Secure:   isProduction(),
		Expires:  expiresAt,
	})
}

func isProduction() bool {
	return os.Getenv("APP_ENV") == "production"
}
