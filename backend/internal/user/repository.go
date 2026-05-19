package user

import (
	"database/sql"
	"time"
)

type UserRepository interface {
	Create(username string, passwordHash string) (User, error)
	FindByUsername(username string) (User, error)
	GetMeByID(id int) (User, error)
	CreateSession(userID int, refreshTokenHash string, expiresAt time.Time) error
	FindSessionByRefreshTokenHash(refreshTokenHash string) (Session, error)
	RevokeSessionByRefreshTokenHash(refreshTokenHash string) error
}

type Repository struct {
	db *sql.DB
}

func NewRepository(db *sql.DB) *Repository {
	return &Repository{db: db}
}

func (r *Repository) Create(username string, passwordHash string) (User, error) {
	result, err := r.db.Exec("INSERT INTO users (username, password_hash) VALUES (?, ?)", username, passwordHash)
	if err != nil {
		return User{}, err
	}

	id, err := result.LastInsertId()
	if err != nil {
		return User{}, err
	}

	return User{
		ID:           int(id),
		Username:     username,
		PasswordHash: passwordHash,
	}, nil
}

func (r *Repository) FindByUsername(username string) (User, error) {
	row := r.db.QueryRow("SELECT id, username, password_hash FROM users WHERE username = ?", username)
	var user User
	err := row.Scan(&user.ID, &user.Username, &user.PasswordHash)
	if err != nil {
		return User{}, err
	}

	return user, nil
}

func (r *Repository) GetMeByID(id int) (User, error) {
	row := r.db.QueryRow("SELECT id, username FROM users WHERE id = ?", id)
	var user User
	err := row.Scan(&user.ID, &user.Username)
	if err != nil {
		return User{}, err
	}

	return user, nil
}

func (r *Repository) CreateSession(userID int, refreshTokenHash string, expiresAt time.Time) error {
	_, err := r.db.Exec("INSERT INTO sessions (user_id, refresh_token_hash, expires_at) VALUES (?, ?, ?)", userID, refreshTokenHash, expiresAt)
	return err
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

func (r *Repository) RevokeSessionByRefreshTokenHash(refreshTokenHash string) error {
	_, err := r.db.Exec(`
		UPDATE sessions
		SET revoked_at = CURRENT_TIMESTAMP
		WHERE refresh_token_hash = ?
	`, refreshTokenHash)

	return err
}
