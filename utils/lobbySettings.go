package utils

import (
	"database/sql"
	"fmt"
	"time"

	"github.com/salvizj/Redraw/db"
	"github.com/salvizj/Redraw/types"

)

func CreateLobbySettings() (string, error) {
	LobbySettingsId := GenerateUUID()
	Status := types.StatusWaiting
	LobbySettings := types.LobbySettings{
		LobbySettingsId: LobbySettingsId,
		PlayerCount:     0,
		MaxPlayerCount:  10,
		Status:          Status,
		CreatedAt:       time.Now(),
	}

	query := `INSERT INTO LobbySettings (LobbySettingsId, PlayerCount, MaxPlayerCount, Status, CreatedAt)
              VALUES (?, ?, ?, ?, ?)`
	_, err := db.DB.Exec(query, LobbySettings.LobbySettingsId, LobbySettings.PlayerCount, LobbySettings.MaxPlayerCount, LobbySettings.Status, LobbySettings.CreatedAt)
	if err != nil {
		return "", err
	}

	return LobbySettings.LobbySettingsId, nil
}

func GetLobbySettingsIdByLobbyId (LobbyId string)(string, error){
	var LobbySettingsId string

	query := `SELECT LobbySettingsId FROM Lobby WHERE LobbyId = ?`
	err := db.DB.QueryRow(query, LobbyId).Scan(&LobbySettingsId)
	if err != nil {
		if err == sql.ErrNoRows {
			return "", fmt.Errorf("no lobby found with the given LobbyId: %s", LobbyId)
		}
		return "", err
	}

	return LobbySettingsId, nil
}