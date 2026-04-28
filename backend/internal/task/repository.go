package task

import "errors"

var tasks = []Task{
	{ID: 1, Title: "Task 1", Status: "pending"},
	{ID: 2, Title: "Task 2", Status: "completed"},
}

func GetAll() []Task {
	return tasks
}

func Create(newTask Task) Task {
	if newTask.Status == "" {
		newTask.Status = "todo"
	}

	newTask.ID = len(tasks) + 1
	tasks = append(tasks, newTask)

	return newTask
}

func Delete(id int) error {
	for i, t := range tasks {
		if t.ID == id {
			tasks = append(tasks[:i], tasks[i+1:]...)
			return nil
		}
	}

	return errors.New("task not found")
}

func Update(id int, req UpdateTaskRequest) (Task, error) {
	for i, t := range tasks {
		if t.ID == id {
			if req.Title != nil {
				tasks[i].Title = *req.Title
			}

			if req.Status != nil {
				tasks[i].Status = *req.Status
			}

			return tasks[i], nil
		}
	}

	return Task{}, errors.New("task not found")
}
