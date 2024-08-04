package db

import (
	"fmt"
	"os"
)

func CreateTables() {
    createSessionTable := `
    CREATE TABLE IF NOT EXISTS session (
        sessionId VARCHAR(36) PRIMARY KEY,
        userId VARCHAR(36),
        roomUserId VARCHAR(36),
        username VARCHAR(255),
        createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        expiresAt DATETIME,
        FOREIGN KEY (userId) REFERENCES user(userId) ON DELETE SET NULL,
        FOREIGN KEY (roomUserId) REFERENCES roomUser(roomUserId) ON DELETE SET NULL
    );`

    createUserTable := `
    CREATE TABLE IF NOT EXISTS user (
        userId VARCHAR(36) PRIMARY KEY,
        username VARCHAR(255) UNIQUE NOT NULL,
        createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    );`

    createRoomSettingsTable := `
    CREATE TABLE IF NOT EXISTS roomSettings (
        roomSettingsId VARCHAR(36) PRIMARY KEY,
        adminId VARCHAR(36) NOT NULL,
        playerCount INT DEFAULT 0,
        maxPlayers INT DEFAULT 10,
        status VARCHAR(20),
        createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (adminId) REFERENCES user(userId) ON DELETE SET NULL
    );`

    createRoomUserTable := `
    CREATE TABLE IF NOT EXISTS roomUser (
        roomUserId VARCHAR(36) PRIMARY KEY,
        roomSettingsId VARCHAR(36) NOT NULL,
        userId VARCHAR(36) NOT NULL,
        username VARCHAR(255) NOT NULL,
        role VARCHAR(20), 
        status VARCHAR(20),
        createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (roomSettingsId) REFERENCES roomSettings(roomSettingsId) ON DELETE CASCADE,
        FOREIGN KEY (userId) REFERENCES user(userId) ON DELETE CASCADE
    );`

    if _, err := DB.Exec(createSessionTable); err != nil {
        fmt.Fprintf(os.Stderr, "Error creating sessions table: %v\n", err)
    }

    if _, err := DB.Exec(createUserTable); err != nil {
        fmt.Fprintf(os.Stderr, "Error creating users table: %v\n", err)
    }

    if _, err := DB.Exec(createRoomSettingsTable); err != nil {
        fmt.Fprintf(os.Stderr, "Error creating roomSettings table: %v\n", err)
    }

    if _, err := DB.Exec(createRoomUserTable); err != nil {
        fmt.Fprintf(os.Stderr, "Error creating roomUsers table: %v\n", err)
    }
}
