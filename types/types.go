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
	LobbyId         string    `json:"lobbyId"`
	LobbySettingsId string    `json:"lobbySettingsId"`
	Status          Status    `json:"status"`
	CreatedAt       time.Time `json:"createdAt"`
}

type LobbySettings struct {
	LobbySettingsId string    `json:"lobbySettingsId"`
	PlayerCount     int       `json:"playerCount"`
	MaxPlayerCount  int       `json:"maxPlayerCount"`
	Status          Status    `json:"status"`
	CreatedAt       time.Time `json:"createdAt"`
}

type Session struct {
	SessionId          string    `json:"sessionId"`
	Username           string    `json:"username"`
	LobbyId            string    `json:"lobbyId"`
	Role               Role      `json:"role"`
	SubmittedPrompt    string    `json:"submittedPrompt"`
	ReceivedPrompt     string    `json:"receivedPrompt"`
	HasSubmittedPrompt bool      `json:"hasSubmittedPrompt"`
	CreatedAt          time.Time `json:"createdAt"`
}

type PlayerDetails struct {
	Username string `json:"username"`
	Role     string `json:"role"`
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
	Type      MessageType `json:"type"`
	SessionID string      `json:"sessionId"`
	LobbyID   string      `json:"lobbyId"`
	Data      any         `json:"data"`
}
