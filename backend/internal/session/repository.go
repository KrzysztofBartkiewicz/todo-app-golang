package session

import (
	"database/sql"
	"time"
)

type SessionRepository interface {
	CreateSession(userID int, refreshTokenHash string, expiresAt time.Time) error
	FindSessionByRefreshTokenHash(refreshTokenHash string) (Session, error)
	RevokeSessionByRefreshTokenHash(refreshTokenHash string) (int64, error)
	RotateSession(oldRefreshTokenHash string, userID int) (string, time.Time, error)
}

type Repository struct {
	db *sql.DB
}

func NewRepository(db *sql.DB) *Repository {
	return &Repository{db: db}
}

func (r *Repository) StartSession(userID int) (string, time.Time, error) {
	rawToken, err := makeRefreshToken()
	if err != nil {
		return "", time.Time{}, err
	}

	hashedToken := hashToken(rawToken)
	expiresAt := time.Now().Add(refreshTokenTTL)

	err = r.CreateSession(userID, hashedToken, expiresAt)
	if err != nil {
		return "", time.Time{}, err
	}

	return rawToken, expiresAt, nil
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

func (r *Repository) RotateSession(oldRefreshTokenHash string, userID int) (string, time.Time, error) {
	rawToken, err := makeRefreshToken()
	if err != nil {
		return "", time.Time{}, err
	}

	hashedToken := hashToken(rawToken)
	expiresAt := time.Now().Add(refreshTokenTTL)

	tx, err := r.db.Begin()
	if err != nil {
		return "", time.Time{}, err
	}

	defer func() {
		_ = tx.Rollback()
	}()

	result, err := tx.Exec(`
		UPDATE sessions
		SET revoked_at = CURRENT_TIMESTAMP
		WHERE refresh_token_hash = ?
		AND revoked_at IS NULL
	`, oldRefreshTokenHash)

	if err != nil {
		return "", time.Time{}, err
	}

	rowsAffected, err := result.RowsAffected()
	if err != nil {
		return "", time.Time{}, err
	}

	if rowsAffected == 0 {
		return "", time.Time{}, sql.ErrNoRows
	}

	_, err = tx.Exec(`
		INSERT INTO sessions (user_id, refresh_token_hash, expires_at)
		VALUES (?, ?, ?)
	`, userID, hashedToken, expiresAt)

	if err != nil {
		return "", time.Time{}, err
	}

	if err := tx.Commit(); err != nil {
		return "", time.Time{}, err
	}

	return rawToken, expiresAt, nil
}
