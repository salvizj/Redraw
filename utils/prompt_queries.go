package utils

import (
	"database/sql"
	"fmt"
	"log"
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
	sessionQuery := `SELECT DISTINCT SessionId FROM Prompt WHERE LobbyId = ? AND SessionId IS NOT NULL`
	rows, err := db.DB.Query(sessionQuery, lobbyId)
	if err != nil {
		return fmt.Errorf("failed to retrieve session IDs for lobbyId %s: %v", lobbyId, err)
	}
	defer rows.Close()

	var sessionIds []string
	for rows.Next() {
		var sessionId string
		if err := rows.Scan(&sessionId); err != nil {
			return fmt.Errorf("error scanning session ID: %v", err)
		}
		sessionIds = append(sessionIds, sessionId)
	}

	if len(sessionIds) < 2 {
		return fmt.Errorf("at least two distinct sessions are required for assignment in lobbyId %s", lobbyId)
	}

	tx, err := db.DB.Begin()
	if err != nil {
		return fmt.Errorf("failed to start transaction: %v", err)
	}
	defer func() {
		if p := recover(); p != nil {
			tx.Rollback()
			err = fmt.Errorf("panic occurred: %v", p)
		} else if err != nil {
			tx.Rollback()
		} else {
			err = tx.Commit()
		}
	}()

	r := rand.New(rand.NewSource(time.Now().UnixNano()))
	r.Shuffle(len(sessionIds), func(i, j int) {
		sessionIds[i], sessionIds[j] = sessionIds[j], sessionIds[i]
	})

	updateStmt, err := tx.Prepare("UPDATE Prompt SET AssignedToSessionId = ? WHERE PromptId = ?")
	if err != nil {
		return fmt.Errorf("failed to prepare update statement: %v", err)
	}
	defer updateStmt.Close()

	for i, currentSessionId := range sessionIds {
		nextSessionId := sessionIds[(i+1)%len(sessionIds)]

		promptQuery := `
            SELECT PromptId
            FROM Prompt
            WHERE LobbyId = ?
            AND SessionId = ?
            AND (AssignedToSessionId IS NULL OR AssignedToSessionId != ?)
            ORDER BY RANDOM()
            LIMIT 1`

		var promptId string
		err := tx.QueryRow(promptQuery, lobbyId, currentSessionId, currentSessionId).Scan(&promptId)
		if err != nil {
			if err == sql.ErrNoRows {
				log.Printf("No unassigned prompts found for sessionId %s, skipping...", currentSessionId)
				continue
			}
			return fmt.Errorf("failed to retrieve prompt for sessionId %s: %v", currentSessionId, err)
		}

		_, err = updateStmt.Exec(nextSessionId, promptId)
		if err != nil {
			return fmt.Errorf("failed to update AssignedToSessionId for prompt %s: %v", promptId, err)
		}
		log.Printf("Updated prompt %s with AssignedToSessionId %s", promptId, nextSessionId)
	}

	return nil
}
