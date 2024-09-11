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
	Join             MessageType = "join"
	Leave            MessageType = "leave"
	StartGame        MessageType = "startGame"
	Notification     MessageType = "notification"
	NavigateToGame   MessageType = "navigateToGame"
	SyncPlayers      MessageType = "syncPlayers"
	AllPlayersSynced MessageType = "allPlayersSynced"
	StartCountdown   MessageType = "startCountdown"
	SubmitPrompt     MessageType = "submitPrompt"
)

type Message struct {
	Type      MessageType `json:"type"`
	SessionID string      `json:"sessionId"`
	LobbyID   string      `json:"lobbyId"`
	Data      any         `json:"data"`
}
type Prompt struct {
	PromptId  string `json:"promptId"`
	Prompt    string `json:"prompt"`
	SessionId string `json:"sessionId"`
	LobbyId   string `json:"lobbyId"`
	Username  string `json:"username"`
}
