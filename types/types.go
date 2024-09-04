package types

import "time"

type Status string

const (
	StatusWaiting Status = "waiting"
	StatusActive  Status = "active"
)

type Role string

const (
	RoleLeader Role = "leader"
	RolePlayer Role = "player"
)

type Lobby struct {
	LobbyId         string
	LobbySettingsId string
	Status          Status
	CreatedAt       time.Time
}

type LobbySettings struct {
	LobbySettingsId string
	PlayerCount     int
	MaxPlayerCount  int
	Status          Status
	CreatedAt       time.Time
}

type Session struct {
	SessionId          string
	Username           string
	LobbyId            string
	Role               Role
	SubmittedPrompt    string
	ReceivedPrompt     string
	HasSubmittedPrompt bool
	CreatedAt          time.Time
}
type PlayerDetails struct {
	Username string
	Role     string
}

type MessageType string

const (
	Join         MessageType = "join"
	Leave        MessageType = "leave"
	StartGame    MessageType = "startGame"
	Notification MessageType = "notification"
	GameStarted  MessageType = "gameStarted"
)

type Message struct {
	Type      MessageType
	SessionID string
	LobbyID   string
	Data      any
}
