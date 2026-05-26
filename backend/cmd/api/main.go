package main

import (
	"context"
	"encoding/json"
	"log"
	"net/http"
	"os"
	"os/signal"
	"time"
	"todo-app/backend/internal/auth"
	"todo-app/backend/internal/database"
	"todo-app/backend/internal/server"
	"todo-app/backend/internal/session"
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
	sessionRepo := session.NewRepository(db)

	http.Handle(
		"/health",
		http.TimeoutHandler(
			server.WithRequestID(server.WithLogger(healthHandler)),
			5*time.Second,
			"Health check timed out",
		),
	)

	server.RegisterRoutes(tasksRepo, userRepo, sessionRepo)

	srv := &http.Server{
		Addr:    port,
		Handler: server.WithCORS(http.DefaultServeMux),
	}

	log.Println("Server running on http://localhost" + port)

	go func() {
		if err := srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			log.Fatal("Server failed to start: ", err)
		}
	}()

	quit := make(chan os.Signal, 1)
	signal.Notify(quit, os.Interrupt)
	<-quit

	log.Println("Shutting down server...")

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	err = srv.Shutdown(ctx)
	if err != nil {
		log.Fatal("Server forced to shutdown: ", err)
	}

	log.Println("Server stopped gracefully")
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
