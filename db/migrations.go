package db

import (
	"fmt"
	"os"
)

func CreateTables() {
	createLobbyTable := `
	CREATE TABLE IF NOT EXISTS Lobby (
		LobbyId TEXT PRIMARY KEY,
		LobbySettingsId TEXT
	);
	`

	createLobbySettingsTable := `
	CREATE TABLE IF NOT EXISTS LobbySettings (
		LobbySettingsId TEXT PRIMARY KEY,
		MaxPlayerCount INT,
		LobbyStatus TEXT,
		DrawingTime INT,
		PromtInputTime INT
	);
	`

	createSessionTable := `
	CREATE TABLE IF NOT EXISTS Session (
		SessionId TEXT PRIMARY KEY,
		Username TEXT UNIQUE,
		LobbyId TEXT,
		Role TEXT,
		CreatedAt DATETIME
	);
	`

	createPromptTable := `
	CREATE TABLE IF NOT EXISTS Prompt (
		PromptId TEXT PRIMARY KEY,
		Prompt TEXT,
		SessionId TEXT,
		LobbyId TEXT,
		Username TEXT
	);
	`
	createPromptAssignmentTable := `
	CREATE TABLE IF NOT EXISTS PromptAssignments (
		PromptId TEXT PRIMARY KEY,
		SessionId TEXT,
		FOREIGN KEY (PromptId) REFERENCES Prompt(PromptId)
	);
	`
	createCanvasTable := `
	CREATE TABLE IF NOT EXISTS Canvas (
		CanvasId TEXT PRIMARY KEY,
		PromptId TEXT,
		CanvasData TEXT,
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
	if _, err := DB.Exec(createPromptTable); err != nil {
		fmt.Fprintf(os.Stderr, "Error creating Prompt table: %v\n", err)
	}
	if _, err := DB.Exec(createCanvasTable); err != nil {
		fmt.Fprintf(os.Stderr, "Error creating Canvas table: %v\n", err)
	}
	if _, err := DB.Exec(createPromptAssignmentTable); err != nil {
		fmt.Fprintf(os.Stderr, "Error creating PromtAssignmentTable table: %v\n", err)
	}
}
