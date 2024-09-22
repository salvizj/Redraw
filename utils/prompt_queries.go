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
		SELECT PromptId, Prompt, SessionId, LobbyId, Username, AssignedToSessionId
		FROM Prompt
		WHERE AssignedToSessionId = ? AND LobbyId = ?
		LIMIT 1`

	err := db.DB.QueryRow(query, sessionId, lobbyId).Scan(
		&prompt.PromptId,
		&prompt.Prompt,
		&prompt.SessionId,
		&prompt.LobbyId,
		&prompt.Username,
		&prompt.AssignedToSessionId,
	)

	if err != nil {
		if err == sql.ErrNoRows {
			return prompt, fmt.Errorf("no prompt found for AssignedToSessionId %s and LobbyId %s", sessionId, lobbyId)
		}
		return prompt, err
	}

	return prompt, nil
}
