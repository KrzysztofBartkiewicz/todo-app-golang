package user

import "database/sql"

type UserRepository interface {
	Create(username string, passwordHash string) (User, error)
	FindByUsername(username string) (User, error)
	GetMeByID(id int) (User, error)
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
