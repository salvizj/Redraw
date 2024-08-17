package utils

import (
	"time"

	"github.com/salvizj/Redraw/db"
)
type Session struct {
	SessionId string
	Username  string
	LobbyId   string
	Role      string
	SubmittedPrompt string 
	ReceivedPrompt string 
	HasSubmittedPrompt bool
	CreatedAt time.Time
}

func CreateSession(LobbyId, Username, Role string) (string, error) {
	SessionId := GenerateUUID()
	Session := Session{
		SessionId: SessionId,
		Username:  Username,
		LobbyId:   LobbyId,
		Role:      Role,
		SubmittedPrompt: "",
		ReceivedPrompt: "",
		HasSubmittedPrompt: false,
		CreatedAt: time.Now(),
	}

	query := `INSERT INTO Session (SessionId, Username, LobbyId, Role,  SubmitedPromt, ReceivedPromt, HasSubmiotedPromt,  CreatedAt)
              VALUES (?, ?, ?, ?)`
	_, err := db.DB.Exec(query, Session.SessionId, Session.Username, Session.LobbyId, Session.Role,Session.SubmittedPrompt, Session.ReceivedPrompt, Session.HasSubmittedPrompt ,Session.CreatedAt)
	if err != nil {
		return "", err
	}

	return Session.SessionId, nil
}
