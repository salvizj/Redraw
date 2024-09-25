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
	Join                  MessageType = "join"
	Leave                 MessageType = "leave"
	StartGame             MessageType = "startGame"
	EnteredGame           MessageType = "enteredGame"
	AssignPromptsComplete MessageType = "assignPromptsComplete"
	GotPrompt             MessageType = "gotPrompt"
	SubmitedPrompt        MessageType = "submitedPrompt"
	EditLobbySettings     MessageType = "editLobbySettings"
)

type Message struct {
	Type      MessageType `json:"type"`
	SessionID string      `json:"sessionId"`
	LobbyID   string      `json:"lobbyId"`
	Data      any         `json:"data"`
}
type Prompt struct {
	PromptId            string `json:"promptId"`
	Prompt              string `json:"prompt"`
	SessionId           string `json:"sessionId"`
	LobbyId             string `json:"lobbyId"`
	Username            string `json:"username"`
	AssignedToSessionId string `json:"assignedToSessionId"`
}
type Canvas struct {
	CanvasId            string `json:"canvasId"`
	CanvasData          string `json:"canvasData"`
	PromptId            string `json:"promptId"`
	SessionId           string `json:"sessionId"`
	LobbyId             string `json:"lobbyId"`
	AssignedToSessionId string `json:"assignedToSessionId"`
}
type GetCanvasRequest struct {
	LobbyId   string `json:"lobbyId"`
	SessionID string `json:"sessionId"`
}
type GetCanvasResponse struct {
	Canvas Canvas `json:"canvas"`
}
type CreateCanvasRequest struct {
	PromptId   string `json:"promptId"`
	CanvasData string `json:"canvasData"`
	LobbyID    string `json:"lobbyId"`
}
type CreateLobbyRequest struct {
	Username string `json:"username"`
}
type LobbyDetailsResponse struct {
	LobbyId       string          `json:"lobbyId"`
	Players       []PlayerDetails `json:"players"`
	Role          string          `json:"role"`
	Username      string          `json:"username"`
	LobbySettings LobbySettings   `json:"lobbySettings"`
}
type JoinLobbyRequest struct {
	Username string `json:"username"`
	LobbyId  string `json:"lobbyId"`
}
type GetPromptRequest struct {
	SessionID string `json:"sessionId"`
	LobbyID   string `json:"lobbyId"`
}
type GetPromptResponse struct {
	Prompt Prompt `json:"prompt"`
}
type UserDetailsResponse struct {
	SessionID string `json:"sessionId"`
	LobbyID   string `json:"lobbyId"`
	Role      string `json:"role"`
	Username  string `json:"username"`
}
type UsernameExistRequest struct {
	Username string `json:"username"`
	LobbyID  string `json:"lobbyId"`
}

type UsernameExistResponse struct {
	Exists    bool `json:"exists"`
	Available bool `json:"available"`
}

type AssignPromptResponse struct {
	Status  string `json:"status"`
	Message string `json:"message"`
}
type AssignPromptRequeststruct struct {
	LobbyId string `json:"lobbyId"`
}
