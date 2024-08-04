package utils

import (
	"database/sql"
	"errors"
	"time"

	"github.com/salvizj/Redraw/db"
)

type User struct {
    UserId    string
    Username  string
    CreatedAt time.Time
}

func CreateUser(username string) (string, error) {
    userId := GenerateUUID()
    user := User{
        UserId:    userId,
        Username:  username,
        CreatedAt: time.Now(),
    }

    query := `INSERT INTO user (userId, username, createdAt) VALUES (?, ?, ?)`
    _, err := db.DB.Exec(query, user.UserId, user.Username, user.CreatedAt)
    if err != nil {
        return "", err
    }

    return userId, nil
}

func UserExists(username string) (bool, error) {
    var count int
    query := `SELECT COUNT(*) FROM user WHERE username = ?`
    err := db.DB.QueryRow(query, username).Scan(&count)
    if err != nil {
        return false, err
    }

    return count > 0, nil
}

func GetUser(username string) (User, error) {
    var user User
    query := `SELECT userId, username, createdAt FROM user WHERE username = ?`
    err := db.DB.QueryRow(query, username).Scan(&user.UserId, &user.Username, &user.CreatedAt)
    if err != nil {
        if err == sql.ErrNoRows {
            return user, errors.New("user not found")
        }
        return user, err
    }

    return user, nil
}
