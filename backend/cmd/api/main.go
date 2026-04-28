package main

import (
	"encoding/json"
	"net/http"
	"todo-app/backend/internal/server"
)

func main() {
	http.HandleFunc("/health", server.WithCORS(healthHandler))

	server.RegisterRoutes()

	err := http.ListenAndServe(":8080", nil)
	if err != nil {
		panic(err)
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
