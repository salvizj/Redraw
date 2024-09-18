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
	envFilePath := ".env"
	if _, err := os.Stat(envFilePath); !os.IsNotExist(err) {
		if err := godotenv.Load(envFilePath); err != nil {
			fmt.Fprintf(os.Stderr, "Error loading .env file: %v\n", err)
			os.Exit(1)
		}
	}

	url := os.Getenv("TURSO_DATABASE_URL")
	token := os.Getenv("TURSO_AUTH_TOKEN")

	if url == "" || token == "" {
		fmt.Fprintf(os.Stderr, "TURSO_DATABASE_URL and TURSO_AUTH_TOKEN must be set\n")
		os.Exit(1)
	}

	connURL := fmt.Sprintf("%s?authToken=%s", url, token)

	var err error
	DB, err = sql.Open("libsql", connURL)
	if err != nil {
		fmt.Fprintf(os.Stderr, "Failed to open db %s: %s\n", connURL, err)
		os.Exit(1)
	}
}
