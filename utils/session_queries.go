package utils

import (
	"database/sql"
	"fmt"
	"net/http"
	"time"

	"github.com/salvizj/Redraw/db"
	"github.com/salvizj/Redraw/types"
)

func SetSessionCookie(w http.ResponseWriter, sessionId string) {
	http.SetCookie(w, &http.Cookie{
		Name:     "sessionId",
		Value:    sessionId,
		Path:     "/",
		Secure:   false,
		HttpOnly: true,
		SameSite: http.SameSiteLaxMode,
	})
}
func GetSession(sessionId string) (*types.Session, error) {
	var session types.Session
	query := `SELECT SessionId, Username, LobbyId, Role, CreatedAt
              FROM Session WHERE SessionId = ?`
	err := db.DB.QueryRow(query, sessionId).Scan(
		&session.SessionId,
		&session.Username,
		&session.LobbyId,
		&session.Role,
		&session.CreatedAt,
	)
	if err != nil {
		if err == sql.ErrNoRows {
			return nil, fmt.Errorf("session not found: %w", err)
		}
		return nil, fmt.Errorf("failed to retrieve session: %w", err)
	}

	return &session, nil
}
func CreateSession(session types.Session) (string, error) {
	session.SessionId = GenerateUUID()
	session.CreatedAt = time.Now()

	query := `INSERT INTO Session (SessionId, Username, LobbyId, Role, CreatedAt)
              VALUES (?, ?, ?, ?, ?)`

	_, err := db.DB.Exec(query,
		session.SessionId,
		session.Username,
		session.LobbyId,
		session.Role,
		session.CreatedAt,
	)
	if err != nil {
		return "", fmt.Errorf("failed to create session: %w", err)
	}

	return session.SessionId, nil
}
