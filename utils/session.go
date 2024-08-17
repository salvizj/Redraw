package utils

import (
	"time"

	"github.com/salvizj/Redraw/db"
)
type Session struct {
	SessionId string
	Username  string
	LobbyId   string
	SubmittedPrompt string 
	ReceivedPrompt string 
	HasSubmittedPrompt bool
	CreatedAt time.Time
}

func CreateSession(LobbyId, Username string) (string, error) {
	SessionId := GenerateUUID()
	Session := Session{
		SessionId: SessionId,
		Username:  Username,
		LobbyId:   LobbyId,
		SubmittedPrompt: "",
		ReceivedPrompt: "",
		HasSubmittedPrompt: false,
		CreatedAt: time.Now(),
	}

	query := `INSERT INTO Session (SessionId, Username, LobbyId, SubmitedPromt, ReceivedPromt, HasSubmiotedPromt,  CreatedAt)
              VALUES (?, ?, ?, ?)`
	_, err := db.DB.Exec(query, Session.SessionId, Session.Username, Session.LobbyId,Session.SubmittedPrompt, Session.ReceivedPrompt, Session.HasSubmittedPrompt ,Session.CreatedAt)
	if err != nil {
		return "", err
	}

	return Session.SessionId, nil
}
