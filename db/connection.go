package db

import (
	"database/sql"
	"fmt"
	"os"

	"github.com/joho/godotenv"
	_ "github.com/tursodatabase/libsql-client-go/libsql"
)

var DB *sql.DB

func Initialize() {
	url := os.Getenv("TURSO_DATABASE_URL")
	token := os.Getenv("TURSO_AUTH_TOKEN")

	if url == "" || token == "" {
		envFilePath := ".env"
		if _, err := os.Stat(envFilePath); !os.IsNotExist(err) {
			if err := godotenv.Load(envFilePath); err != nil {
				fmt.Fprintf(os.Stderr, "Error loading .env file: %v\n", err)
			}
			url = os.Getenv("TURSO_DATABASE_URL")
			token = os.Getenv("TURSO_AUTH_TOKEN")
		}
	}

	if url == "" {
		fmt.Fprintf(os.Stderr, "Error: Environment variable TURSO_DATABASE_URL is not set\n")
		os.Exit(1)
	}
	if token == "" {
		fmt.Fprintf(os.Stderr, "Error: Environment variable TURSO_AUTH_TOKEN is not set\n")
		os.Exit(1)
	}

	connURL := fmt.Sprintf("%s?authToken=%s", url, token)

	var err error
	DB, err = sql.Open("libsql", connURL)
	if err != nil {
		fmt.Fprintf(os.Stderr, "Failed to open database connection: %s\n", err)
		os.Exit(1)
	}

	if err := DB.Ping(); err != nil {
		fmt.Fprintf(os.Stderr, "Failed to ping database: %s\n", err)
		os.Exit(1)
	}
}
