package utils

import (
	"database/sql"
	"fmt"
	"net/http"
	"time"

	"github.com/google/uuid"
	"github.com/salvizj/Redraw/db"
	"github.com/salvizj/Redraw/types"
)

func GenerateUUID() string {
	return uuid.New().String()
}

func CreateSession(LobbyId, Username string, Role types.Role) (string, error) {
	SessionId := GenerateUUID()
	Session := types.Session{
		SessionId:          SessionId,
		Username:           Username,
		LobbyId:            LobbyId,
		Role:               Role,
		SubmittedPrompt:    "",
		ReceivedPrompt:     "",
		HasSubmittedPrompt: false,
		CreatedAt:          time.Now(),
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
		return "", fmt.Errorf("failed to create session: %w", err)
	}

	return Session.SessionId, nil
}

func GetSessionById(sessionId string) (*types.Session, error) {
	var session types.Session
	query := `SELECT SessionId, Username, LobbyId, Role, SubmittedPrompt, ReceivedPrompt, HasSubmittedPrompt, CreatedAt
              FROM Session WHERE SessionId = ?`
	err := db.DB.QueryRow(query, sessionId).Scan(
		&session.SessionId, &session.Username, &session.LobbyId, &session.Role,
		&session.SubmittedPrompt, &session.ReceivedPrompt, &session.HasSubmittedPrompt, &session.CreatedAt,
	)
	if err != nil {
		if err == sql.ErrNoRows {
			return nil, fmt.Errorf("session not found: %w", err)
		}
		return nil, fmt.Errorf("failed to retrieve session: %w", err)
	}

	return &session, nil
}

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
		return "", fmt.Errorf("failed to create lobby settings: %w", err)
	}

	return LobbySettings.LobbySettingsId, nil
}

func GetLobbySettingsIdByLobbyId(LobbyId string) (string, error) {
	var LobbySettingsId string
	query := `SELECT LobbySettingsId FROM Lobby WHERE LobbyId = ?`
	err := db.DB.QueryRow(query, LobbyId).Scan(&LobbySettingsId)
	if err != nil {
		if err == sql.ErrNoRows {
			return "", fmt.Errorf("no lobby found with the given LobbyId: %s", LobbyId)
		}
		return "", fmt.Errorf("failed to get lobby settings ID: %w", err)
	}

	return LobbySettingsId, nil
}

func CreateLobby(LobbySettingsId string) (string, error) {
	Status := types.StatusWaiting
	LobbyId := GenerateUUID()
	Lobby := types.Lobby{
		LobbyId:         LobbyId,
		LobbySettingsId: LobbySettingsId,
		Status:          Status,
		CreatedAt:       time.Now(),
	}

	query := `INSERT INTO Lobby (LobbyId, LobbySettingsId, Status, CreatedAt)
              VALUES (?, ?, ?, ?)`
	_, err := db.DB.Exec(query, Lobby.LobbyId, Lobby.LobbySettingsId, Lobby.Status, Lobby.CreatedAt)
	if err != nil {
		return "", fmt.Errorf("failed to create lobby: %w", err)
	}

	return Lobby.LobbyId, nil
}

// GetLobbyIdBySessionId retrieves the LobbyId associated with a SessionId
func GetLobbyIdBySessionId(SessionId string) (string, error) {
	var LobbyId string
	query := `SELECT LobbyId FROM Session WHERE SessionId = ?`
	err := db.DB.QueryRow(query, SessionId).Scan(&LobbyId)
	if err != nil {
		if err == sql.ErrNoRows {
			return "", fmt.Errorf("no lobby found with the given SessionId: %s", SessionId)
		}
		return "", fmt.Errorf("failed to get lobby ID: %w", err)
	}

	return LobbyId, nil
}

func SetSessionCookie(w http.ResponseWriter, sessionId string) {
	http.SetCookie(w, &http.Cookie{
		Name:     "sessionId",
		Value:    sessionId,
		Path:     "/",
		Secure:   true,
		HttpOnly: false,
		SameSite: http.SameSiteLaxMode,
	})
}
