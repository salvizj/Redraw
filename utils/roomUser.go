package utils

import (
	"time"

	"github.com/salvizj/Redraw/db"
)

type RoomUser struct {
	RoomUserId    string
	RoomSettingsId string
	UserId        string
	Username      string
	Role          string
	Status        string
	CreatedAt     time.Time
}

func CreateRoomUser(roomSettingsId, userId, username, role string) (string, error) {
	roomUserId := GenerateUUID()
	roomUser := RoomUser{
		RoomUserId:    roomUserId,
		RoomSettingsId: roomSettingsId,
		UserId:        userId,
		Username:      username,
		Role:          role,
		Status:        "active",
		CreatedAt:     time.Now(),
	}

	query := `INSERT INTO roomUser (roomUserId, roomSettingsId, userId, username, role, status, createdAt)
              VALUES (?, ?, ?, ?, ?, ?, ?)`
	_, err := db.DB.Exec(query, roomUser.RoomUserId, roomUser.RoomSettingsId, roomUser.UserId, roomUser.Username, roomUser.Role, roomUser.Status, roomUser.CreatedAt)
	if err != nil {
		return "", err
	}

	return roomUser.RoomUserId, nil
}

func AddUserToRoomUser(roomUserId, userId, username string) (string, error) {
	// Get roomSettingsId using the provided roomUserId
	roomSettingsId, err := GetRoomSettingsIdByRoomUserId(roomUserId)
	if err != nil {
		return "", err
	}

	role := "player"

	query := `
        INSERT INTO roomUser (roomUserId, roomSettingsId, userId, username, role, createdAt)
        VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP)`
	_, err = db.DB.Exec(query, GenerateUUID(), roomSettingsId, userId, username, role)
	if err != nil {
		return "", err
	}

	return roomUserId, nil
}

func GetRoomSettingsIdByRoomUserId(roomUserId string) (string, error) {
	var roomSettingsId string
	query := `SELECT roomSettingsId FROM roomUser WHERE roomUserId = ? LIMIT 1`
	err := db.DB.QueryRow(query, roomUserId).Scan(&roomSettingsId)
	if err != nil {
		return "", err
	}
	return roomSettingsId, nil
}

func RoomUserExists(roomUserId string) (bool, error) {
	var count int
	query := `SELECT COUNT(*) FROM roomUser WHERE roomUserId = ?`
	err := db.DB.QueryRow(query, roomUserId).Scan(&count)
	if err != nil {
		return false, err
	}
	return count > 0, nil
}
