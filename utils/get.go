package utils

import (
	"database/sql"
	"fmt"

	"github.com/salvizj/Redraw/db"
	"github.com/salvizj/Redraw/types"
)

func GetSessionById(sessionId string) (*types.Session, error) {
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
func GetLobbySettings(LobbyId string) (types.LobbySettings, error) {
	LobbySettingsId, err := GetLobbySettingsIdByLobbyId(LobbyId)
	if err != nil {
		return types.LobbySettings{}, fmt.Errorf("failed to get lobby settings ID: %w", err)
	}

	var lobbySettings types.LobbySettings
	query := `SELECT LobbySettingsId, MaxPlayerCount, LobbyStatus, DrawingTime, PromtInputTime 
              FROM LobbySettings WHERE LobbySettingsId = ?`

	err = db.DB.QueryRow(query, LobbySettingsId).Scan(
		&lobbySettings.LobbySettingsId,
		&lobbySettings.MaxPlayerCount,
		&lobbySettings.LobbyStatus,
		&lobbySettings.DrawingTime,
		&lobbySettings.PromtInputTime,
	)

	if err == sql.ErrNoRows {
		return types.LobbySettings{}, fmt.Errorf("no lobby settings found for LobbySettingsId: %s", LobbySettingsId)
	} else if err != nil {
		return types.LobbySettings{}, fmt.Errorf("failed to get lobby settings: %w", err)
	}

	return lobbySettings, nil
}
func GetPromptBySessionIdAndLobbyId(sessionId, lobbyId string) (types.Prompt, error) {
	var prompt types.Prompt

	query := `
        SELECT p.PromptId, p.Prompt, p.SessionId, p.LobbyId, p.Username
        FROM Prompt p
        LEFT JOIN PromptAssignments pa ON p.PromptId = pa.PromptId
        WHERE p.LobbyId = ? AND (pa.SessionId IS NULL OR pa.SessionId != ?)
        ORDER BY RANDOM()
        LIMIT 1
    `
	err := db.DB.QueryRow(query, lobbyId, sessionId).Scan(
		&prompt.PromptId, &prompt.Prompt, &prompt.SessionId,
		&prompt.LobbyId, &prompt.Username,
	)

	if err != nil {
		if err == sql.ErrNoRows {
			return prompt, fmt.Errorf("no available prompts for lobby %s", lobbyId)
		}
		return prompt, fmt.Errorf("failed to get prompt: %w", err)
	}

	_, err = db.DB.Exec(`
        INSERT INTO PromptAssignments (PromptId, SessionId)
        VALUES (?, ?)
        ON CONFLICT (PromptId) DO UPDATE SET SessionId = ?
    `, prompt.PromptId, sessionId, sessionId)

	if err != nil {
		return prompt, fmt.Errorf("failed to assign prompt: %w", err)
	}

	return prompt, nil
}
