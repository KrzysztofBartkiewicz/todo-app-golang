package auth

import (
	"context"
	"fmt"
	"net/http"
	"strings"
	"todo-app/backend/internal/response"

	"github.com/golang-jwt/jwt/v5"
)

func Middleware(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		authHeader := r.Header.Get("Authorization")

		if authHeader == "" {
			response.WriteJSONError(w, http.StatusUnauthorized, "Missing authorization header")
			return
		}

		tokenString := strings.TrimPrefix(authHeader, "Bearer ")

		if tokenString == authHeader {
			response.WriteJSONError(w, http.StatusUnauthorized, "Invalid authorization header format")
			return
		}

		token, err := jwt.ParseWithClaims(tokenString, &Claims{}, func(token *jwt.Token) (any, error) {
			if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
				return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
			}
			return jwtSecret, nil
		})

		if err != nil {
			response.WriteJSONError(w, http.StatusUnauthorized, "Invalid or expired token")
			return
		}

		claims, ok := token.Claims.(*Claims)
		if !ok {
			response.WriteJSONError(w, http.StatusUnauthorized, "Invalid token claims")
			return
		}

		userID := claims.UserID

		ctx := context.WithValue(r.Context(), userIDKey, userID)

		next(w, r.WithContext(ctx))
	}
}

