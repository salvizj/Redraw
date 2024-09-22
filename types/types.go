package types

import "time"

type LobbyStatus string

const (
	StatusWaiting LobbyStatus = "waiting"
	StatusActive  LobbyStatus = "active"
)

type Role string

const (
	RoleLeader Role = "leader"
	RolePlayer Role = "player"
)

type Lobby struct {
	LobbyId         string `json:"lobbyId"`
	LobbySettingsId string `json:"lobbySettingsId"`
}

type LobbySettings struct {
	LobbySettingsId string      `json:"lobbySettingsId"`
	MaxPlayerCount  int         `json:"maxPlayerCount"`
	PromptInputTime int         `json:"promptInputTime"`
	DrawingTime     int         `json:"drawingTime"`
	LobbyStatus     LobbyStatus `json:"lobbyStatus"`
}

type Session struct {
	SessionId string    `json:"sessionId"`
	Username  string    `json:"username"`
	LobbyId   string    `json:"lobbyId"`
	Role      Role      `json:"role"`
	CreatedAt time.Time `json:"createdAt"`
}

type PlayerDetails struct {
	Username string `json:"username"`
	Role     string `json:"role"`
}

type MessageType string

const (
	Join              MessageType = "join"
	Leave             MessageType = "leave"
	StartGame         MessageType = "startGame"
	NavigateToGame    MessageType = "navigateToGame"
	EnteredGame       MessageType = "enteredGame"
	GotPrompt         MessageType = "gotPrompt"
	SubmitedPrompt    MessageType = "submitedPrompt"
	EditLobbySettings MessageType = "editLobbySettings"
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
type Canvas struct {
	CanvasId   string `json:"canvasId"`
	CanvasData string `json:"canvasData"`
	Prompt     string `json:"prompt"`
	SessionId  string `json:"sessionId"`
	LobbyId    string `json:"lobbyId"`
}
