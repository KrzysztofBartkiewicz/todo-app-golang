package task

import (
	"database/sql"
	"errors"
)

var ErrTaskNotFound = errors.New("task not found")

type TaskRepository interface {
	CreateByUserID(task Task, userID int) (Task, error)
	GetAllByUserID(userID int) ([]Task, error)
	DeleteByIDAndUserID(taskID, userID int) error
	UpdateByTaskIDAndUserID(taskID, userID int, req UpdateTaskRequest) (Task, error)
}

type Repository struct {
	db *sql.DB
}

func NewRepository(db *sql.DB) *Repository {
	return &Repository{db: db}
}

func (r *Repository) GetAllByUserID(userID int) ([]Task, error) {
	rows, err := r.db.Query(
		`SELECT id, title, status, user_id 
		FROM tasks
		WHERE user_id = ?`,
		userID,
	)

	if err != nil {
		return nil, err
	}

	defer rows.Close()

	tasks := []Task{}

	for rows.Next() {
		var t Task

		err := rows.Scan(&t.ID, &t.Title, &t.Status, &t.UserID)
		if err != nil {
			return nil, err
		}

		tasks = append(tasks, t)
	}

	if err := rows.Err(); err != nil {
		return nil, err
	}

	return tasks, nil
}

func (r *Repository) CreateByUserID(newTask Task, userID int) (Task, error) {
	if newTask.Status == "" {
		newTask.Status = "todo"
	}

	result, err := r.db.Exec("INSERT INTO tasks (title, status, user_id) VALUES (?, ?, ?)", newTask.Title, newTask.Status, userID)
	if err != nil {
		return Task{}, err
	}

	id, err := result.LastInsertId()
	if err != nil {
		return Task{}, err
	}

	newTask.ID = int(id)
	return newTask, nil
}

func (r *Repository) DeleteByIDAndUserID(taskID, userID int) error {
	result, err := r.db.Exec("DELETE FROM tasks WHERE id = ? AND user_id = ?", taskID, userID)
	if err != nil {
		return err
	}

	rowsAffected, err := result.RowsAffected()
	if err != nil {
		return err
	}

	if rowsAffected == 0 {
		return ErrTaskNotFound
	}

	return nil
}

func (r *Repository) UpdateByTaskIDAndUserID(taskID, userID int, req UpdateTaskRequest) (Task, error) {
	var updatedTask Task

	err := r.db.QueryRow(
		`SELECT id, title, status, user_id
		FROM tasks
		WHERE id = ? AND user_id = ?`,
		taskID,
		userID,
	).Scan(&updatedTask.ID, &updatedTask.Title, &updatedTask.Status, &updatedTask.UserID)

	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return Task{}, ErrTaskNotFound
		}
		return Task{}, err
	}

	if req.Title != nil {
		updatedTask.Title = *req.Title
	}

	if req.Status != nil {
		updatedTask.Status = *req.Status
	}

	_, err = r.db.Exec(`UPDATE tasks SET title = ?, status = ? WHERE id = ? AND user_id = ?`,
		updatedTask.Title,
		updatedTask.Status,
		updatedTask.ID,
		updatedTask.UserID,
	)

	if err != nil {
		return Task{}, err
	}

	return updatedTask, nil
}
