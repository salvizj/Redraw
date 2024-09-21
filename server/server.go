package server

import (
	"fmt"
	"net/http"
	"os"

	"github.com/joho/godotenv"
	"github.com/salvizj/Redraw/api/middleware"
	"github.com/salvizj/Redraw/api/routes"
	"github.com/salvizj/Redraw/db"
)

func checkEnvVars() bool {
	authToken := os.Getenv("TURSO_AUTH_TOKEN")
	databaseURL := os.Getenv("TURSO_DATABASE_URL")
	baseURL := os.Getenv("VITE_BASE_URL")
	port := os.Getenv("VITE_PORT")

	return authToken != "" && databaseURL != "" && baseURL != "" && port != ""
}

func init() {
	if !checkEnvVars() {
		if err := godotenv.Load(); err != nil {
			fmt.Println("Error loading .env file, continuing with default environment variables")
		} else {
			fmt.Println("Loaded .env file")
		}
	}
}

func StartServer() {
	db.Initialize()
	defer db.DB.Close()

	db.CreateTables()

	mux := routes.InitializeRoutes()

	corsHandler := middleware.CORS(mux)

	port := getenv("VITE_PORT", "10000")
	baseURL := getenv("VITE_BASE_URL", "localhost")
	fmt.Printf("Server is running on %s:%s\n", baseURL, port)

	if err := http.ListenAndServe(fmt.Sprintf("0.0.0.0:%s", port), corsHandler); err != nil {
		fmt.Printf("Server failed to start: %s\n", err)
	}
}

func getenv(key, defaultValue string) string {
	if value, exists := os.LookupEnv(key); exists {
		return value
	}
	return defaultValue
}
