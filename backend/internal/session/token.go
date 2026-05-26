package session

import (
	"crypto/rand"
	"crypto/sha256"
	"encoding/hex"
	"time"
)

const refreshTokenTTL = 7 * 24 * time.Hour

func makeRefreshToken() (string, error) {
	b := make([]byte, 32)
	_, err := rand.Read(b)
	if err != nil {
		return "", err
	}
	return hex.EncodeToString(b), nil
}

func hashToken(token string) string {
	sum := sha256.Sum256([]byte(token))
	return hex.EncodeToString(sum[:])
}
