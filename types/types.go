package types

import "time"

type Status string

const (
	StatusWaiting   Status = "waiting"
	StatusActive    Status = "active"
	StatusCompleted Status = "completed"
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
	Username string `json:"username"`
	Role     string `json:"role"`
}
type Message struct {
	Type      string `json:"type"`
	Content   string `json:"content"`
	SessionId string `json:"sessionId,omitempty"`
	LobbyId   string `json:"lobbyId,omitempty"`
}
