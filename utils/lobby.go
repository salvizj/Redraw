package utils

import (
	"database/sql"
	"fmt"
	"time"

	"github.com/salvizj/Redraw/db"
)

type Lobby struct {
	LobbyId    string
	LobbySettingsId string
	Username      string
	Role          string
	CreatedAt     time.Time
}

func CreateLobby (LobbySettingsId, Username, Role string) (string, error){
	LobbyId := GenerateUUID()
	    Lobby := Lobby{
		LobbyId: LobbyId,
        LobbySettingsId: LobbySettingsId,
		Username: Username,
		Role: Role,
 		CreatedAt: time.Now(),
    }

	query := `INSERT INTO Lobby (LobbyId, LobbySettingsId, Username, Role, CreatedAt)
              VALUES (?, ?, ?, ?, ?)`
    _, err := db.DB.Exec(query, Lobby.LobbyId, Lobby.LobbySettingsId, Lobby.Username, Lobby.Role, Lobby.CreatedAt)
    if err != nil {
        return "", err
    }

    return Lobby.LobbyId, nil
}
func JoinLobby (LobbyId, LobbySettingsId, Username, Role string) (string, error){
	    Lobby := Lobby{
		LobbyId: LobbyId,
        LobbySettingsId: LobbySettingsId,
		Username: Username,
		Role: Role,
 		CreatedAt: time.Now(),
    }

	query := `INSERT INTO Lobby (LobbyId, LobbySettingsId, Username, Role, CreatedAt)
              VALUES (?, ?, ?, ?, ?)`
    _, err := db.DB.Exec(query, Lobby.LobbyId, Lobby.LobbySettingsId, Lobby.Username, Lobby.Role, Lobby.CreatedAt)
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

