package db

import (
	"fmt"
	"os"
)

func CreateTables() {
	createLobbyTable := `
	CREATE TABLE IF NOT EXISTS Lobby (
		LobbyId TEXT PRIMARY KEY,
		LobbySettingsId TEXT,
		Username TEXT,
		Role TEXT,
		CreatedAt DATETIME
	);
	`

	createLobbySettingsTable := `
	CREATE TABLE IF NOT EXISTS LobbySettings (
		LobbySettingsId TEXT PRIMARY KEY,
		PlayerCount INT,
		MaxPlayerCount INT,
		Status TEXT,
		CreatedAt DATETIME
	);
	`

	createSessionTable := `
	CREATE TABLE IF NOT EXISTS Session (
		SessionId TEXT PRIMARY KEY,
		Username TEXT,
		LobbyId TEXT,
		Role TEXT,
		SubmittedPrompt TEXT, 
		ReceivedPrompt TEXT, 
		HasSubmittedPrompt BOOLEAN DEFAULT FALSE,
		CreatedAt DATETIME
	);
	`


	if _, err := DB.Exec(createLobbyTable); err != nil {
		fmt.Fprintf(os.Stderr, "Error creating Lobby table: %v\n", err)
	}
	if _, err := DB.Exec(createLobbySettingsTable); err != nil {
		fmt.Fprintf(os.Stderr, "Error creating LobbySettings table: %v\n", err)
	}
	if _, err := DB.Exec(createSessionTable); err != nil {
		fmt.Fprintf(os.Stderr, "Error creating Session table: %v\n", err)
	}

	fmt.Println("Tables created successfully")

}
