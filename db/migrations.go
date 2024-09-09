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
		Status TEXT,               
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
		Username TEXT UNIQUE,
		LobbyId TEXT,
		Role TEXT,                 
		SubmittedPrompt TEXT,       
		ReceivedPrompt TEXT,        
		HasSubmittedPrompt BOOLEAN DEFAULT FALSE,
		CreatedAt DATETIME
	);
	`
	createPromtTable := `
	CREATE TABLE IF NOT EXISTS Prompt (
		PromptId TEXT PRIMARY KEY,
		Prompt TEXT,
		SessionId TEXT,
		LobbyId TEXT,
		Username TEXT,
		CreatedAt DATETIME
	);
	`
	createCanvasTable := `
	CREATE TABLE IF NOT EXISTS Canvas (
    CanvasId TEXT PRIMARY KEY,
    PromptId TEXT,
    CanvasData TEXT,  -- Base64 encoded data
    CreatedAt DATETIME,
    FOREIGN KEY (PromptId) REFERENCES Prompt(PromptId)
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
	if _, err := DB.Exec(createPromtTable); err != nil {
		fmt.Fprintf(os.Stderr, "Error creating Promt table: %v\n", err)
	}
	if _, err := DB.Exec(createCanvasTable); err != nil {
		fmt.Fprintf(os.Stderr, "Error creating Canavs table: %v\n", err)
	}
}
