package utils

import (
	"database/sql"
	"fmt"

	"github.com/salvizj/Redraw/db"
	"github.com/salvizj/Redraw/types"
)

func EditLobbySettings(settings types.LobbySettings) error {
	query := `
		UPDATE LobbySettings
		SET MaxPlayerCount = ?, 
		    DrawingTime = ?, 
		    PromptInputTime = ?
		WHERE LobbySettingsId = ?
	`

	_, err := db.DB.Exec(query,
		settings.MaxPlayerCount,
		settings.DrawingTime,
		settings.PromptInputTime,
		settings.LobbySettingsId,
	)

	if err != nil {
		return fmt.Errorf("failed to update lobby settings: %w", err)
	}

	return nil
}
func GetLobbySettingsIdByLobbyId(LobbyId string) (string, error) {
	var LobbySettingsId string
	query := `SELECT LobbySettingsId FROM Lobby WHERE LobbyId = ?`
	err := db.DB.QueryRow(query, LobbyId).Scan(&LobbySettingsId)
	if err != nil {
		return "", fmt.Errorf("failed to get lobby settings: %w", err)
	}

	return LobbySettingsId, nil
}
func GetLobbySettings(LobbyId string) (types.LobbySettings, error) {
	LobbySettingsId, err := GetLobbySettingsIdByLobbyId(LobbyId)
	if err != nil {
		return types.LobbySettings{}, fmt.Errorf("failed to get lobby settings ID: %w", err)
	}

	var lobbySettings types.LobbySettings
	query := `SELECT LobbySettingsId, MaxPlayerCount, DrawingTime, PromptInputTime 
              FROM LobbySettings WHERE LobbySettingsId = ?`

	err = db.DB.QueryRow(query, LobbySettingsId).Scan(
		&lobbySettings.LobbySettingsId,
		&lobbySettings.MaxPlayerCount,
		&lobbySettings.DrawingTime,
		&lobbySettings.PromptInputTime,
	)
	if err != nil {
		if err == sql.ErrNoRows {
			return types.LobbySettings{}, fmt.Errorf("no lobby settings found for LobbySettingsId: %s", LobbySettingsId)
		}
		return types.LobbySettings{}, fmt.Errorf("failed to get lobby settings: %w", err)
	}

	return lobbySettings, nil
}
func CreateLobbySettings(settings types.LobbySettings) (string, error) {
	settings.LobbySettingsId = GenerateUUID()

	query := `INSERT INTO LobbySettings (LobbySettingsId, MaxPlayerCount, DrawingTime, PromptInputTime)
              VALUES (?, ?, ?, ?)`
	_, err := db.DB.Exec(query, settings.LobbySettingsId, settings.MaxPlayerCount, settings.DrawingTime, settings.PromptInputTime)
	if err != nil {
		return "", fmt.Errorf("failed to create lobby settings: %w", err)
	}

	return settings.LobbySettingsId, nil
}
