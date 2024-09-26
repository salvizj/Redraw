package utils

import (
	"database/sql"
	"fmt"

	"github.com/salvizj/Redraw/db"
)

func CreateGameState(lobbyId string, initialState string) error {
	gameStateId := GenerateUUID()

	query := `
    INSERT INTO GameState (GameStateId, LobbyId, CurrentState)
    VALUES (?, ?, ?);
    `
	_, err := db.DB.Exec(query, gameStateId, lobbyId, initialState)
	if err != nil {
		return fmt.Errorf("failed to create game state for lobbyId %s: %v", lobbyId, err)
	}
	return nil
}

func UpdateGameState(lobbyId string, newState string) error {
	query := `
    UPDATE GameState
    SET CurrentState = ?
    WHERE LobbyId = ?;
    `

	_, err := db.DB.Exec(query, newState, lobbyId)
	if err != nil {
		return fmt.Errorf("failed to update game state for lobbyId %s: %v", lobbyId, err)
	}
	return nil
}

func GetGameState(lobbyId string) (string, error) {
	var currentState string

	query := `
    SELECT CurrentState
    FROM GameState
    WHERE LobbyId = ?;
    `

	err := db.DB.QueryRow(query, lobbyId).Scan(&currentState)
	if err != nil {
		if err == sql.ErrNoRows {
			return "", fmt.Errorf("no game state found for lobbyId %s", lobbyId)
		}
		return "", fmt.Errorf("failed to retrieve game state for lobbyId %s: %v", lobbyId, err)
	}

	return currentState, nil
}
