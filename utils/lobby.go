package utils

import (
	"database/sql"
	"fmt"
	"time"

	"github.com/salvizj/Redraw/db"
	"github.com/salvizj/Redraw/types"
)

func CreateLobby (LobbySettingsId string) (string, error){
	Status := types.StatusWaiting
	LobbyId := GenerateUUID()
	    Lobby := types.Lobby{
		LobbyId: LobbyId,
        LobbySettingsId: LobbySettingsId,
		Status: Status,
 		CreatedAt: time.Now(),
    }

	query := `INSERT INTO Lobby (LobbyId, LobbySettingsId, Status, CreatedAt)
              VALUES (?, ?, ?, ?)`
    _, err := db.DB.Exec(query, Lobby.LobbyId, Lobby.LobbySettingsId, Lobby.Status, Lobby.CreatedAt)
    if err != nil {
        return "", err
    }

    return Lobby.LobbyId, nil
}


func GetLobbyIdBySessionId(SessionId string) (string, error) {
	var LobbyId string

	query := `SELECT LobbyId FROM Session WHERE SessionId = ?`
	err := db.DB.QueryRow(query, SessionId).Scan(&LobbyId)
	if err != nil {
		if err == sql.ErrNoRows {
			return "", fmt.Errorf("no lobby found with the given SessionId: %s", SessionId)
		}
		return "", err
	}

	return LobbyId, nil
}

