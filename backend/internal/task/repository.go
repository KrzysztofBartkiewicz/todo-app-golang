package task

import (
	"database/sql"
	"errors"
)

var ErrTaskNotFound = errors.New("task not found")

type TaskRepository interface {
	Create(task Task) (Task, error)
	GetAll() ([]Task, error)
	Delete(id int) error
	Update(id int, req UpdateTaskRequest) (Task, error)
}

type Repository struct {
	db *sql.DB
}

func NewRepository(db *sql.DB) *Repository {
	return &Repository{db: db}
}

func (r *Repository) GetAll() ([]Task, error) {
	rows, err := r.db.Query("SELECT id, title, status FROM tasks")
	if err != nil {
		return nil, err
	}

	defer rows.Close()

	tasks := []Task{}

	for rows.Next() {
		var t Task

		err := rows.Scan(&t.ID, &t.Title, &t.Status)
		if err != nil {
			return nil, err
		}
		tasks = append(tasks, t)
	}

	return tasks, nil
}

func (r *Repository) Create(newTask Task) (Task, error) {
	if newTask.Status == "" {
		newTask.Status = "todo"
	}

	result, err := r.db.Exec("INSERT INTO tasks (title, status) VALUES (?, ?)", newTask.Title, newTask.Status)
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

func (r *Repository) Delete(id int) error {
	result, err := r.db.Exec("DELETE FROM tasks WHERE id = ?", id)
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

func (r *Repository) Update(id int, req UpdateTaskRequest) (Task, error) {
	var updatedTask Task
	err := r.db.QueryRow("SELECT id, title, status FROM tasks WHERE id = ?", id).Scan(&updatedTask.ID, &updatedTask.Title, &updatedTask.Status)
	if err != nil {
		if err == sql.ErrNoRows {
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

	_, err = r.db.Exec("UPDATE tasks SET title = ?, status = ? WHERE id = ?", updatedTask.Title, updatedTask.Status, updatedTask.ID)
	if err != nil {
		return Task{}, err
	}

	return updatedTask, nil
}
