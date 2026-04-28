package task

type Task struct {
	ID     int    `json:"id"`
	Title  string `json:"title"`
	Status string `json:"status"`
}

type UpdateTaskRequest struct {
	Title  *string `json:"title"`
	Status *string `json:"status"`
}
