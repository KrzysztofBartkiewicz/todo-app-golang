package task

type Task struct {
	ID     int    `json:"id"`
	Title  string `json:"title"`
	Status string `json:"status"`
	UserID int    `json:"user_id"`
}

type UpdateTaskRequest struct {
	Title  *string `json:"title"`
	Status *string `json:"status"`
}

type CreateTaskRequest struct {
	Title  string `json:"title"`
	Status string `json:"status"`
}

func isValidStatus(status string) bool {
	switch status {
	case "todo", "in_progress", "done":
		return true
	default:
		return false
	}
}
