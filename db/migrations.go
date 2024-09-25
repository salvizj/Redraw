package db

import (
	"fmt"
	"os"
)

func CreateTables() {
	tables := []struct {
		name  string
		query string
	}{
		{
			name: "Lobby",
			query: `
            CREATE TABLE IF NOT EXISTS Lobby (
                LobbyId TEXT PRIMARY KEY,
                LobbySettingsId TEXT UNIQUE,
                FOREIGN KEY (LobbySettingsId) REFERENCES LobbySettings(LobbySettingsId)
            );`,
		},
		{
			name: "LobbySettings",
			query: `
            CREATE TABLE IF NOT EXISTS LobbySettings (
                LobbySettingsId TEXT PRIMARY KEY,
                MaxPlayerCount INTEGER,
                LobbyStatus TEXT,
                DrawingTime INTEGER,
                PromptInputTime INTEGER
            );`,
		},
		{
			name: "Session",
			query: `
            CREATE TABLE IF NOT EXISTS Session (
                SessionId TEXT PRIMARY KEY,
                Username TEXT UNIQUE,
                LobbyId TEXT,
                Role TEXT,
                CreatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (LobbyId) REFERENCES Lobby(LobbyId)
            );`,
		},
		{
			name: "Prompt",
			query: `
            CREATE TABLE IF NOT EXISTS Prompt (
                PromptId TEXT PRIMARY KEY,
                Prompt TEXT NOT NULL,
                SessionId TEXT,
                LobbyId TEXT,
                Username TEXT,
                AssignedToSessionId TEXT,
                FOREIGN KEY (SessionId) REFERENCES Session(SessionId),
                FOREIGN KEY (LobbyId) REFERENCES Lobby(LobbyId)
            );`,
		},
		{
			name: "Canvas",
			query: `
            CREATE TABLE IF NOT EXISTS Canvas (
                CanvasId TEXT PRIMARY KEY,
                SessionId TEXT,
                PromptId TEXT,
                CanvasData TEXT,
                LobbyId TEXT,
                AssignetToSessionId TEXT,
                FOREIGN KEY (SessionId) REFERENCES Session(SessionId),
                FOREIGN KEY (PromptId) REFERENCES Prompt(PromptId),
                FOREIGN KEY (LobbyId) REFERENCES Lobby(LobbyId)
            );`,
		},
	}

	for _, table := range tables {
		if _, err := DB.Exec(table.query); err != nil {
			fmt.Fprintf(os.Stderr, "Error creating %s table: %v\n", table.name, err)
		}
	}
}
