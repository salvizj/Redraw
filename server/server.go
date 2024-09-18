package server

import (
	"fmt"
	"net/http"
	"net/url"
	"os"

	"github.com/gorilla/handlers"
	"github.com/joho/godotenv"
	"github.com/salvizj/Redraw/api/routes"
	"github.com/salvizj/Redraw/db"
)

func checkEnvVars() bool {
	authToken := os.Getenv("TURSO_AUTH_TOKEN")
	databaseURL := os.Getenv("TURSO_DATABASE_URL")
	baseURL := os.Getenv("VITE_BASE_URL")
	port := os.Getenv("PORT")

	return authToken != "" && databaseURL != "" && baseURL != "" && port != ""
}

func init() {
	if checkEnvVars() {
		fmt.Println("Critical environment variables found, skipping .env file loading")
	} else {
		if err := godotenv.Load(); err != nil {
			fmt.Println("Error loading .env file, continuing with default environment variables")
		} else {
			fmt.Println("Loaded .env file")
		}
	}
	fmt.Println("VITE_BASE_URL:", getenv("VITE_BASE_URL", "http://localhost:8080"))
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

	baseURL := getenv("VITE_BASE_URL", "http://localhost:8080")
	host, port := parseURL(baseURL)

	fmt.Printf("Server is running on http://%s:%s\n", host, port)
	if err := http.ListenAndServe(fmt.Sprintf("%s:%s", host, port), corsHandler); err != nil {
		fmt.Printf("Server failed to start: %s\n", err)
	}
}

func getenv(key, defaultValue string) string {
	if value, exists := os.LookupEnv(key); exists {
		return value
	}
	return defaultValue
}

func parseURL(rawURL string) (string, string) {
	parsedURL, err := url.Parse(rawURL)
	if err != nil {
		fmt.Printf("Error parsing URL: %s\n", err)
		return "localhost", "8080"
	}
	host := parsedURL.Hostname()
	port := parsedURL.Port()
	if port == "" {
		port = "8080"
	}
	return host, port
}
