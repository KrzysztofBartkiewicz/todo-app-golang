package main

import (
	"encoding/json"
	"log"
	"net/http"
	"todo-app/backend/internal/auth"
	"todo-app/backend/internal/database"
	"todo-app/backend/internal/server"
	"todo-app/backend/internal/task"
	"todo-app/backend/internal/user"

	"github.com/joho/godotenv"
)

const port = ":8080"

func main() {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}

	auth.LoadSecret()

	db, err := database.Open()
	if err != nil {
		log.Fatal(err)
	}

	defer db.Close()

	tasksRepo := task.NewRepository(db)
	userRepo := user.NewRepository(db)

	http.HandleFunc("/health", server.WithLogger(server.WithCORS(healthHandler)))

	server.RegisterRoutes(tasksRepo, userRepo)

	log.Println("Server running on http://localhost" + port)

	err = http.ListenAndServe(port, nil)
	if err != nil {
		log.Fatal(err)
	}
}

func healthHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	err := json.NewEncoder(w).Encode(map[string]string{
		"status": "ok",
	})
	if err != nil {
		http.Error(w, "Failed to encode response", http.StatusInternalServerError)
	}
}
