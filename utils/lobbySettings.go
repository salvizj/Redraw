package utils

import (
	"database/sql"
	"fmt"
	"time"

	"github.com/salvizj/Redraw/db"
)
type LobbySettings struct {
	LobbySettingsId string
	PlayerCount     int
	MaxPlayerCount  int
	Status          string
	CreatedAt       time.Time
}
func CreateLobbySettings() (string, error) {
	LobbySettingsId := GenerateUUID()
	LobbySettings := LobbySettings{
		LobbySettingsId: LobbySettingsId,
		PlayerCount:     0,
		MaxPlayerCount:  10,
		Status:          "Active",
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