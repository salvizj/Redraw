package types

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
	PromtInputTime  int         `json:"promtInputTime"`
	DrawingTime     int         `json:"drawingTime"`
	LobbyStatus     LobbyStatus `json:"lobbyStatus"`
}

type Session struct {
	SessionId string `json:"sessionId"`
	Username  string `json:"username"`
	LobbyId   string `json:"lobbyId"`
	Role      Role   `json:"role"`
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
