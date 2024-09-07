package utils

import (
	"database/sql"
	"fmt"

	"github.com/salvizj/Redraw/db"
	"github.com/salvizj/Redraw/types"
)

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

func GetLobbyAndUserFromSession(sessionId string) (lobbyId string, role string, username string, err error) {
	session, err := GetSessionById(sessionId)
	if err != nil {
		return "", "", "", err
	}
	lobbyId = session.LobbyId
	role = string(session.Role)
	username = session.Username
	return
}

func GetPlayersInLobby(lobbyId string) ([]types.PlayerDetails, error) {
	var players []types.PlayerDetails
	query := `SELECT Username, Role FROM Session WHERE LobbyId = ?`
	rows, err := db.DB.Query(query, lobbyId)
	if err != nil {
		return nil, fmt.Errorf("failed to retrieve players: %w", err)
	}
	defer rows.Close()

	for rows.Next() {
		var player types.PlayerDetails
		if err := rows.Scan(&player.Username, &player.Role); err != nil {
			return nil, fmt.Errorf("failed to scan player details: %w", err)
		}
		players = append(players, player)
	}

	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("error occurred during rows iteration: %w", err)
	}

	return players, nil
}
func CheckUsernameExist(username, lobbyId string) (bool, error) {
	var count int
	query := `SELECT COUNT(*) FROM Session WHERE Username = ? AND LobbyId = ?`
	err := db.DB.QueryRow(query, username, lobbyId).Scan(&count)
	if err != nil {
		return false, fmt.Errorf("failed to check username existence: %w", err)
	}

	return count > 0, nil
}
