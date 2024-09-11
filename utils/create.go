package utils

import (
	"fmt"
	"time"

	"github.com/salvizj/Redraw/db"
	"github.com/salvizj/Redraw/types"
)

func CreateLobby(LobbySettingsId string) (string, error) {
	Status := types.StatusWaiting
	LobbyId := GenerateUUID()
	Lobby := types.Lobby{
		LobbyId:         LobbyId,
		LobbySettingsId: LobbySettingsId,
		Status:          Status,
		CreatedAt:       time.Now(),
	}

	query := `INSERT INTO Lobby (LobbyId, LobbySettingsId, Status, CreatedAt)
              VALUES (?, ?, ?, ?)`
	_, err := db.DB.Exec(query, Lobby.LobbyId, Lobby.LobbySettingsId, Lobby.Status, Lobby.CreatedAt)
	if err != nil {
		return "", fmt.Errorf("failed to create lobby: %w", err)
	}

	return Lobby.LobbyId, nil
}

func CreateLobbySettings() (string, error) {
	LobbySettingsId := GenerateUUID()
	Status := types.StatusWaiting
	LobbySettings := types.LobbySettings{
		LobbySettingsId: LobbySettingsId,
		MaxPlayerCount:  10,
		Status:          Status,
		CreatedAt:       time.Now(),
	}

	query := `INSERT INTO LobbySettings (LobbySettingsId, MaxPlayerCount, Status, CreatedAt)
              VALUES (?, ?, ?, ?)`
	_, err := db.DB.Exec(query, LobbySettings.LobbySettingsId, LobbySettings.MaxPlayerCount, LobbySettings.Status, LobbySettings.CreatedAt)
	if err != nil {
		return "", fmt.Errorf("failed to create lobby settings: %w", err)
	}

	return LobbySettings.LobbySettingsId, nil
}

func CreateSession(LobbyId, Username string, Role types.Role) (string, error) {
	SessionId := GenerateUUID()
	Session := types.Session{
		SessionId:          SessionId,
		Username:           Username,
		LobbyId:            LobbyId,
		Role:               Role,
		SubmittedPrompt:    "",
		ReceivedPrompt:     "",
		HasSubmittedPrompt: false,
		CreatedAt:          time.Now(),
	}

	query := `INSERT INTO Session (SessionId, Username, LobbyId, Role, SubmittedPrompt, ReceivedPrompt, HasSubmittedPrompt, CreatedAt)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?)`

	_, err := db.DB.Exec(query,
		Session.SessionId,
		Session.Username,
		Session.LobbyId,
		Session.Role,
		Session.SubmittedPrompt,
		Session.ReceivedPrompt,
		Session.HasSubmittedPrompt,
		Session.CreatedAt)
	if err != nil {
		return "", fmt.Errorf("failed to create session: %w", err)
	}

	return Session.SessionId, nil
}

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
		return fmt.Errorf("failed to create prompt: %w", err)
	}

	return nil
}
