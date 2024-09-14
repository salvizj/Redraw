package utils

import (
	"fmt"
	"time"

	"github.com/salvizj/Redraw/db"
	"github.com/salvizj/Redraw/types"
)

func CreateLobby(LobbySettingsId string) (string, error) {
	LobbyId := GenerateUUID()
	Lobby := types.Lobby{
		LobbyId:         LobbyId,
		LobbySettingsId: LobbySettingsId,
	}

	query := `INSERT INTO Lobby (LobbyId, LobbySettingsId)
              VALUES (?, ?)`
	_, err := db.DB.Exec(query, Lobby.LobbyId, Lobby.LobbySettingsId)
	if err != nil {
		return "", fmt.Errorf("failed to create lobby: %w", err)
	}

	return LobbyId, nil
}

func CreateLobbySettings() (string, error) {
	LobbySettingsId := GenerateUUID()
	LobbyStatus := types.StatusWaiting
	LobbySettings := types.LobbySettings{
		LobbySettingsId: LobbySettingsId,
		MaxPlayerCount:  10,
		LobbyStatus:     LobbyStatus,
		DrawingTime:     30,
		PromtInputTime:  20,
	}

	query := `INSERT INTO LobbySettings (LobbySettingsId, MaxPlayerCount, LobbyStatus, DrawingTime, PromtInputTime)
              VALUES (?, ?, ?, ?, ?)`
	_, err := db.DB.Exec(query, LobbySettings.LobbySettingsId, LobbySettings.MaxPlayerCount, LobbySettings.LobbyStatus, LobbySettings.DrawingTime, LobbySettings.PromtInputTime)
	if err != nil {
		return "", fmt.Errorf("failed to create lobby settings: %w", err)
	}

	return LobbySettings.LobbySettingsId, nil
}

func CreateSession(LobbyId, Username string, Role types.Role) (string, error) {
	SessionId := GenerateUUID()
	CreatedAt := time.Now()
	Session := types.Session{
		SessionId: SessionId,
		Username:  Username,
		LobbyId:   LobbyId,
		Role:      Role,
		CreatedAt: CreatedAt,
	}

	query := `INSERT INTO Session (SessionId, Username, LobbyId, Role, CreatedAt)
              VALUES (?, ?, ?, ?, ?)`

	_, err := db.DB.Exec(query,
		Session.SessionId,
		Session.Username,
		Session.LobbyId,
		Session.Role,
		Session.CreatedAt,
	)
	if err != nil {
		return "", fmt.Errorf("failed to create session: %w", err)
	}

	return Session.SessionId, nil
}

func CreatePrompt(prompt types.Prompt) error {
	prompt.PromptId = GenerateUUID()

	query := `INSERT INTO Prompt (PromptId, Prompt, SessionId, LobbyId, Username)
	          VALUES (?, ?, ?, ?, ?)`

	fmt.Printf("Inserting into Prompt table: %v\n", prompt)

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
