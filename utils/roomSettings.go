package utils

import (
	"time"

	"github.com/salvizj/Redraw/db"
)

type RoomSettings struct {
    RoomSettingsId string
    AdminId        string
    PlayerCount    int
    MaxPlayers     int
    Status         string
    CreatedAt      time.Time
}

func CreateRoom(adminId string, maxPlayers int) (string, error) {
    roomSettingsId := GenerateUUID()
    roomSettings := RoomSettings{
        RoomSettingsId: roomSettingsId,
        AdminId:        adminId,
        PlayerCount:    0,
        MaxPlayers:     maxPlayers,
        Status:         "active",
        CreatedAt:      time.Now(),
    }

    query := `INSERT INTO roomSettings (roomSettingsId, adminId, playerCount, maxPlayers, status, createdAt)
              VALUES (?, ?, ?, ?, ?, ?)`
    _, err := db.DB.Exec(query, roomSettings.RoomSettingsId, roomSettings.AdminId, roomSettings.PlayerCount, roomSettings.MaxPlayers, roomSettings.Status, roomSettings.CreatedAt)
    if err != nil {
        return "", err
    }

    return roomSettings.RoomSettingsId, nil
}

