package server

import (
	"fmt"
	"net/http"
	"os"

	"github.com/gorilla/handlers"
	"github.com/joho/godotenv"
	"github.com/salvizj/Redraw/api/routes"
	"github.com/salvizj/Redraw/db"
)

func init() {
	if err := godotenv.Load(); err != nil {
		fmt.Println("Error loading .env file, continuing with default environment variables")
	}
}

func StartServer() {
	db.Initialize()
	defer db.DB.Close()

	db.CreateTables()

	r := routes.InitializeRoutes()

	corsHandler := handlers.CORS(
		handlers.AllowedOrigins([]string{"*"}),
		handlers.AllowedMethods([]string{"GET", "POST", "PUT", "DELETE", "OPTIONS"}),
		handlers.AllowedHeaders([]string{"Content-Type", "Authorization"}),
	)(r)

	port := getenv("PORT", "8080")
	fmt.Printf("Server is running on http://localhost:%s\n", port)
	if err := http.ListenAndServe(":"+port, corsHandler); err != nil {
		fmt.Printf("Server failed to start: %s\n", err)
	}
}

func getenv(key, defaultValue string) string {
	if value, exists := os.LookupEnv(key); exists {
		return value
	}
	return defaultValue
}
