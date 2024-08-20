package utils

import (
	"database/sql"
	"fmt"
	"time"

	"github.com/salvizj/Redraw/db"
	"github.com/salvizj/Redraw/types"
)


func CreateSession(LobbyId, Username string, Role types.Role) (string, error) {
	SessionId := GenerateUUID()
	Session := types.Session{
		SessionId:          SessionId,
		Username:           Username,
		LobbyId:            LobbyId,
		Role:               Role,
		SubmittedPrompt:   "",
		ReceivedPrompt:    "",
		HasSubmittedPrompt: false,
		CreatedAt:         time.Now(),
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
		return "", err
	}

	return Session.SessionId, nil
}
func GetUserRole(SessionId string) (types.Role, error) {
	var Role types.Role

	query := `SELECT Role FROM Session WHERE sessionId = ?`

	err := db.DB.QueryRow(query, SessionId).Scan(&Role)
	if err != nil {
		if err == sql.ErrNoRows {
			return "", fmt.Errorf("no session found with the given SessionId: %s", SessionId)
		}
		return "", err
	}

	return Role, nil
}
