package utils

import (
	"database/sql"
	"time"

	"github.com/salvizj/Redraw/db"
)

type Session struct {
    SessionId string
    Username  string
    UserId    string
    RoomUserId string
    CreatedAt time.Time
}

func CreateSession(username, userId, roomUserId string) (string, error) {
    sessionId := GenerateUUID()
    session := Session{
        SessionId: sessionId,
        Username:  username,
        UserId:    userId,
        RoomUserId:   roomUserId,
        CreatedAt: time.Now(),
    }

    query := `INSERT INTO session (sessionId, username, userId, roomUserId, createdAt)
              VALUES (?, ?, ?, ?, ?)`
    _, err := db.DB.Exec(query, session.SessionId, session.Username, session.UserId, session.RoomUserId, session.CreatedAt)
    if err != nil {
        return "", err
    }

    return sessionId, nil
}

func GetSession(sessionId string) (Session, error) {
    var session Session
    query := `SELECT sessionId, username, userId, lobbyId, createdAt
              FROM session WHERE sessionId = ?`
    err := db.DB.QueryRow(query, sessionId).Scan(&session.SessionId, &session.Username, &session.UserId, &session.RoomUserId, &session.CreatedAt)
    if err != nil {
        if err == sql.ErrNoRows {
            return session, nil
        }
        return session, err
    }
    return session, nil
}