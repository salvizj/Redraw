package utils

import (
	"database/sql"
	"fmt"
	"math/rand"
	"time"

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

	for _, sessionId := range sessionIds {
		var prompt types.Prompt
		promptQuery := `
			SELECT PromptId, Prompt, SessionId, LobbyId, Username, AssignedToSessionId
			FROM Prompt
			WHERE AssignedToSessionId = ? AND LobbyId = ?
			LIMIT 1`

		err := db.DB.QueryRow(promptQuery, sessionId, lobbyId).Scan(
			&prompt.PromptId,
			&prompt.Prompt,
			&prompt.SessionId,
			&prompt.LobbyId,
			&prompt.Username,
			&prompt.AssignedToSessionId,
		)

		if err != nil {
			if err == sql.ErrNoRows {
				continue
			}
			return fmt.Errorf("error fetching prompt for sessionId %s and lobbyId %s: %v", sessionId, lobbyId, err)
		}

		var availableSessions []string
		for _, id := range sessionIds {
			if id != prompt.AssignedToSessionId {
				availableSessions = append(availableSessions, id)
			}
		}

		if len(availableSessions) == 0 {
			return fmt.Errorf("no available session ID to assign for prompt %s", prompt.PromptId)
		}

		rand.Seed(time.Now().UnixNano())
		newSessionId := availableSessions[rand.Intn(len(availableSessions))]

		updateQuery := `UPDATE Prompt SET AssignedToSessionId = ? WHERE PromptId = ?`
		_, err = db.DB.Exec(updateQuery, newSessionId, prompt.PromptId)
		if err != nil {
			return fmt.Errorf("failed to update AssignedToSessionId for prompt %s: %v", prompt.PromptId, err)
		}
	}

	return nil
}
