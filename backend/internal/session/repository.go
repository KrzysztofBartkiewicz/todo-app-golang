package session

import (
	"database/sql"
	"time"
)

type SessionRepository interface {
	CreateSession(userID int, refreshTokenHash string, expiresAt time.Time) error
	FindSessionByRefreshTokenHash(refreshTokenHash string) (Session, error)
	RevokeSessionByRefreshTokenHash(refreshTokenHash string) (int64, error)
}

type Repository struct {
	db *sql.DB
}

func NewRepository(db *sql.DB) *Repository {
	return &Repository{db: db}
}

func (r *Repository) FindSessionByRefreshTokenHash(refreshTokenHash string) (Session, error) {
	row := r.db.QueryRow(`
		SELECT id, user_id, refresh_token_hash, expires_at, revoked_at, created_at
		FROM sessions
		WHERE refresh_token_hash = ?
	`, refreshTokenHash)

	var session Session
	err := row.Scan(&session.ID, &session.UserID, &session.RefreshTokenHash, &session.ExpiresAt, &session.RevokedAt, &session.CreatedAt)
	if err != nil {
		return Session{}, err
	}

	return session, nil
}

func (r *Repository) CreateSession(userID int, refreshTokenHash string, expiresAt time.Time) error {
	_, err := r.db.Exec("INSERT INTO sessions (user_id, refresh_token_hash, expires_at) VALUES (?, ?, ?)", userID, refreshTokenHash, expiresAt)
	return err
}

func (r *Repository) RevokeSessionByRefreshTokenHash(refreshTokenHash string) (int64, error) {
	result, err := r.db.Exec(`
		UPDATE sessions
		SET revoked_at = CURRENT_TIMESTAMP
		WHERE refresh_token_hash = ?
		AND revoked_at IS NULL
	`, refreshTokenHash)

	if err != nil {
		return 0, err
	}

	return result.RowsAffected()
}
