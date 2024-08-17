package utils

import (
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

	// Updated query with correct column names and the correct number of placeholders
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
