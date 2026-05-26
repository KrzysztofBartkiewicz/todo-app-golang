package session

import "time"

type Session struct {
	ID               int
	UserID           int
	RefreshTokenHash string
	ExpiresAt        time.Time
	RevokedAt        *time.Time
	CreatedAt        time.Time
}

type RefreshResponse struct {
	Token string `json:"token"`
}
