package utils

import (
	"database/sql"
	"fmt"

	"github.com/salvizj/Redraw/db"
	"github.com/salvizj/Redraw/types"
)

func CreatePrompt(prompt types.Prompt) error {
	prompt.PromptId = GenerateUUID()

	query := `INSERT INTO Prompt (PromptId, Prompt, SessionId, LobbyId, Username)
	          VALUES (?, ?, ?, ?, ?)`

	_, err := db.DB.Exec(query,
		prompt.PromptId,
		prompt.Prompt,
		prompt.SessionId,
		prompt.LobbyId,
		prompt.Username,
	)

	if err != nil {
		fmt.Printf("Failed to execute query: %v\n", err)
		return fmt.Errorf("failed to create prompt: %w", err)
	}

	return nil
}
func GetPrompt(sessionId, lobbyId string) (types.Prompt, error) {
	var prompt types.Prompt

	query := `
        SELECT p.PromptId, p.Prompt, p.SessionId, p.LobbyId, p.Username
        FROM Prompt p
        LEFT JOIN PromptAssignments pa ON p.PromptId = pa.PromptId
        WHERE p.LobbyId = ? AND (pa.SessionId IS NULL OR pa.SessionId != ?)
        ORDER BY RANDOM()
        LIMIT 1
    `
	err := db.DB.QueryRow(query, lobbyId, sessionId).Scan(
		&prompt.PromptId, &prompt.Prompt, &prompt.SessionId,
		&prompt.LobbyId, &prompt.Username,
	)

	if err != nil {
		if err == sql.ErrNoRows {
			return prompt, fmt.Errorf("no available prompts for lobby %s", lobbyId)
		}
		return prompt, fmt.Errorf("failed to get prompt: %w", err)
	}

	_, err = db.DB.Exec(`
        INSERT INTO PromptAssignments (PromptId, SessionId)
        VALUES (?, ?)
        ON CONFLICT (PromptId) DO UPDATE SET SessionId = ?
    `, prompt.PromptId, sessionId, sessionId)

	if err != nil {
		return prompt, fmt.Errorf("failed to assign prompt: %w", err)
	}

	return prompt, nil
}
