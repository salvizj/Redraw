package utils

import (
	"database/sql"
	"fmt"

	"github.com/salvizj/Redraw/db"
	"github.com/salvizj/Redraw/types"
)

func CreateLobby(lobby types.Lobby) (string, error) {
	lobby.LobbyId = GenerateUUID()

	query := `INSERT INTO Lobby (LobbyId, LobbySettingsId)
              VALUES (?, ?)`
	_, err := db.DB.Exec(query, lobby.LobbyId, lobby.LobbySettingsId)
	if err != nil {
		return "", fmt.Errorf("failed to create lobby: %w", err)
	}

	return lobby.LobbyId, nil
}
func GetLobbyId(SessionId string) (string, error) {
	var LobbyId string
	query := `SELECT LobbyId FROM Session WHERE SessionId = ?`
	err := db.DB.QueryRow(query, SessionId).Scan(&LobbyId)
	if err != nil {
		return "", fmt.Errorf("failed to get lobby ID: %w", err)
	}

	return LobbyId, nil
}
func GetLobbyAndUser(sessionId string) (lobbyId string, role string, username string, err error) {
	session, err := GetSession(sessionId)

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

func UsernameExist(username, lobbyId string) (bool, error) {
	var count int
	query := `SELECT COUNT(*) FROM Session WHERE Username = ? AND LobbyId = ?`
	err := db.DB.QueryRow(query, username, lobbyId).Scan(&count)
	if err != nil {
		return false, fmt.Errorf("failed to check username existence: %w", err)
	}

	return count > 0, nil
}
func LobbyExists(lobbyId string) (bool, error) {
	var exists bool
	query := "SELECT EXISTS(SELECT 1 FROM Lobby WHERE LobbyId = ?)"
	err := db.DB.QueryRow(query, lobbyId).Scan(&exists)
	if err != nil && err != sql.ErrNoRows {
		return false, err
	}
	return exists, nil
}

func IsLobbyFull(lobbyId string) (bool, error) {
	var currentPlayerCount int
	var maxPlayerCount int

	countQuery := `
        SELECT COUNT(*) 
        FROM Session 
        WHERE LobbyId = ?
    `
	err := db.DB.QueryRow(countQuery, lobbyId).Scan(&currentPlayerCount)
	if err != nil {
		return false, err
	}

	maxCountQuery := `
        SELECT MaxPlayerCount 
        FROM LobbySettings 
        WHERE LobbySettingsId = (SELECT LobbySettingsId FROM Lobby WHERE LobbyId = ?)
    `
	err = db.DB.QueryRow(maxCountQuery, lobbyId).Scan(&maxPlayerCount)
	if err != nil {
		return false, err
	}

	return currentPlayerCount >= maxPlayerCount, nil
}
