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
func AssignPrompt(lobbyId string) error {
	var sessionIds []string

	sessionQuery := `SELECT SessionId FROM Session WHERE LobbyId = ?`
	rows, err := db.DB.Query(sessionQuery, lobbyId)
	if err != nil {
		return fmt.Errorf("failed to retrieve session IDs for lobbyId %s: %v", lobbyId, err)
	}
	defer rows.Close()

	for rows.Next() {
		var sessionId string
		if err := rows.Scan(&sessionId); err != nil {
			return fmt.Errorf("error scanning session ID: %v", err)
		}
		sessionIds = append(sessionIds, sessionId)
	}

	if len(sessionIds) == 0 {
		return fmt.Errorf("no session IDs found for lobbyId %s", lobbyId)
	}

	tx, err := db.DB.Begin()
	if err != nil {
		return fmt.Errorf("failed to start transaction: %v", err)
	}
	defer func() {
		if err != nil {
			tx.Rollback()
		} else {
			tx.Commit()
		}
	}()

	for _, currentSessionId := range sessionIds {
		promptQuery := `
            SELECT PromptId
            FROM Prompt
            WHERE LobbyId = ? AND (AssignedToSessionId IS NULL OR AssignedToSessionId != ?)
            AND AssignedToSessionId != ?
            ORDER BY RANDOM()
            LIMIT 1`

		var promptId string
		err := tx.QueryRow(promptQuery, lobbyId, currentSessionId, currentSessionId).Scan(&promptId)
		if err != nil {
			if err == sql.ErrNoRows {
				continue
			}
			return fmt.Errorf("error fetching prompt for lobbyId %s: %v", lobbyId, err)
		}

		updateQuery := `UPDATE Prompt SET AssignedToSessionId = ? WHERE PromptId = ?`
		_, err = tx.Exec(updateQuery, currentSessionId, promptId)
		if err != nil {
			return fmt.Errorf("failed to update AssignedToSessionId for prompt %s: %v", promptId, err)
		}

		fmt.Printf("Assigned prompt %s to session %s\n", promptId, currentSessionId)
	}

	return nil
}
