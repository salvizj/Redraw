package db

import (
	"fmt"
	"os"
)

func CreateTables() {
	createSessionsTable := `
	CREATE TABLE IF NOT EXISTS sessions (
		session_id VARCHAR(36) PRIMARY KEY,
		user_id VARCHAR(36),
		data TEXT,
		created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
		updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
		expires_at DATETIME,
		FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE SET NULL
	);`

	createUsersTable := `
	CREATE TABLE IF NOT EXISTS users (
		user_id VARCHAR(36) PRIMARY KEY,
		username VARCHAR(255) UNIQUE NOT NULL,
		password_hash TEXT NOT NULL,
		created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
	);`

	createRoomsTable := `
	CREATE TABLE IF NOT EXISTS rooms (
		room_id VARCHAR(36) PRIMARY KEY,
		admin_id VARCHAR(36),
		player_count INT DEFAULT 0,
		max_players INT DEFAULT 10, -- Example default maximum room size
		status VARCHAR(20) DEFAULT 'active', -- Example status column
		created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
		FOREIGN KEY (admin_id) REFERENCES users(user_id) ON DELETE SET NULL
	);`

	createLobbiesTable := `
	CREATE TABLE IF NOT EXISTS lobbies (
		lobby_id VARCHAR(36) PRIMARY KEY,
		room_id VARCHAR(36),
		user_id VARCHAR(36),
		role VARCHAR(20) DEFAULT 'player', -- Example role column
		status VARCHAR(20) DEFAULT 'waiting', -- Example lobby status
		created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
		FOREIGN KEY (room_id) REFERENCES rooms(room_id) ON DELETE CASCADE,
		FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
	);`

	_, err := DB.Exec(createSessionsTable)
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error creating sessions table: %v\n", err)
	}

	_, err = DB.Exec(createUsersTable)
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error creating users table: %v\n", err)
	}

	_, err = DB.Exec(createRoomsTable)
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error creating rooms table: %v\n", err)
	}

	_, err = DB.Exec(createLobbiesTable)
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error creating lobbies table: %v\n", err)
	}
}
