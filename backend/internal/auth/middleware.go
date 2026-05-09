package auth

import (
	"context"
	"fmt"
	"net/http"
	"strings"
	"todo-app/backend/internal/response"

	"github.com/golang-jwt/jwt/v5"
)

type contextKey string

const UserIDKey contextKey = "userID"

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

		claims, err := ParseToken(tokenString)

		if err != nil {
			response.WriteJSONError(w, http.StatusUnauthorized, "Invalid or expired token")
			return
		}

		userIDFloat, ok := claims["user_id"].(float64)

		if !ok {
			response.WriteJSONError(w, http.StatusUnauthorized, "Invalid token claims")
			return
		}

		userID := int(userIDFloat)

		ctx := context.WithValue(r.Context(), UserIDKey, userID)

		next(w, r.WithContext(ctx))
	}
}

func ParseToken(tokenString string) (jwt.MapClaims, error) {
	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (any, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
		}
		return jwtSecret, nil
	})

	if err != nil {
		return nil, err
	}

	if !token.Valid {
		return nil, jwt.ErrTokenInvalidClaims
	}

	claims, ok := token.Claims.(jwt.MapClaims)
	if !ok {
		return nil, jwt.ErrTokenInvalidClaims
	}

	return claims, nil
}
