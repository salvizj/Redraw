package server

import (
	"fmt"
	"net/http"

	"github.com/salvizj/Redraw/api/routes"
	"github.com/salvizj/Redraw/db"
)

func corsMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// Check if the request is an upgrade request for WebSocket
		if r.Header.Get("Upgrade") == "websocket" {
			// Allow WebSocket upgrade requests to pass through without modification
			next.ServeHTTP(w, r)
			return
		}

		// Set CORS headers for HTTP requests
		w.Header().Set("Access-Control-Allow-Origin", "http://localhost:5173")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
		w.Header().Set("Access-Control-Allow-Credentials", "true")

		// Handle preflight OPTIONS requests
		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusOK)
			return
		}

		// Call the next handler
		next.ServeHTTP(w, r)
	})
}

// StartServer initializes the database, sets up routes, and starts the server
func StartServer() {
	// Initialize the database
	db.Initialize()
	defer db.DB.Close()

	// Create necessary tables in the database
	db.CreateTables()

	// Initialize routes
	r := routes.InitializeRoutes()

	// Wrap the router with CORS middleware
	corsWrappedRouter := corsMiddleware(r)

	fmt.Println("Server is running on http://localhost:8080")

	// Start the server with the CORS-wrapped router
	if err := http.ListenAndServe(":8080", corsWrappedRouter); err != nil {
		fmt.Printf("Server failed to start: %s\n", err)
	}
}
