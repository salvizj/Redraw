package websocket

import (
	"encoding/json"
	"log"
	"net/http"
	"sync"

	"github.com/gorilla/websocket"
	"github.com/salvizj/Redraw/types"
)

var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

type Client struct {
	conn *websocket.Conn
	send chan []byte
}

type Lobby struct {
	clients           map[string]*Client // key: sessionId
	gameState         types.GameState
	submittedPrompts  int
	gottenPrompts     int
	submittedDrawings int
	mutex             sync.RWMutex
}

var (
	lobbies      = make(map[string]*Lobby) // key: lobbyId
	lobbiesMutex sync.RWMutex
)

func WsHandler(w http.ResponseWriter, r *http.Request) {
	sessionId := r.URL.Query().Get("sessionId")
	lobbyId := r.URL.Query().Get("lobbyId")
	if sessionId == "" || lobbyId == "" {
		http.Error(w, "Session Id and Lobby Id required", http.StatusBadRequest)
		return
	}

	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Printf("Error during connection upgrade: %v", err)
		return
	}

	client := &Client{
		conn: conn,
		send: make(chan []byte, 256),
	}

	lobby := joinLobby(client, sessionId, lobbyId)

	go readMessages(client, lobby, sessionId, lobbyId)
	go writeMessages(client)
}

func joinLobby(client *Client, sessionId, lobbyId string) *Lobby {
	lobbiesMutex.Lock()
	defer lobbiesMutex.Unlock()

	if _, exists := lobbies[lobbyId]; !exists {
		lobbies[lobbyId] = &Lobby{
			clients:   make(map[string]*Client),
			gameState: types.StatusWaitingForPlayers,
		}
	}

	lobby := lobbies[lobbyId]
	lobby.mutex.Lock()
	defer lobby.mutex.Unlock()

	lobby.clients[sessionId] = client

	broadcastMessage(types.Message{
		Type:      types.Join,
		SessionId: sessionId,
		LobbyId:   lobbyId,
	}, lobbyId)

	return lobby
}

func readMessages(client *Client, lobby *Lobby, sessionId, lobbyId string) {
	defer func() {
		leaveLobby(sessionId, lobbyId)
		client.conn.Close()
	}()

	for {
		_, message, err := client.conn.ReadMessage()
		if err != nil {
			if websocket.IsUnexpectedCloseError(err, websocket.CloseGoingAway, websocket.CloseAbnormalClosure) {
				log.Printf("error: %v", err)
			}
			break
		}

		var msg types.Message
		if err := json.Unmarshal(message, &msg); err != nil {
			log.Printf("error: %v", err)
			continue
		}

		handleMessage(msg, lobbyId, sessionId, lobby)
	}
}

func writeMessages(client *Client) {
	defer client.conn.Close()

	for message := range client.send {
		err := client.conn.WriteMessage(websocket.TextMessage, message)
		if err != nil {
			return
		}
	}
}

func leaveLobby(sessionId, lobbyId string) {
	lobbiesMutex.Lock()
	defer lobbiesMutex.Unlock()

	if lobby, exists := lobbies[lobbyId]; exists {
		lobby.mutex.Lock()
		defer lobby.mutex.Unlock()

		delete(lobby.clients, sessionId)
		if len(lobby.clients) == 0 {
			delete(lobbies, lobbyId)
		}
	}
}

func handleMessage(msg types.Message, lobbyId, sessionId string, lobby *Lobby) {
	switch msg.Type {
	case types.Join:
		broadcastMessage(msg, lobbyId)

	case types.StartGame:
		updateGameState(sessionId, lobbyId, types.StatusTypingPrompts)

	case types.SubmittedPrompt:
		lobby.submittedPrompts++
		if lobby.submittedPrompts == len(lobby.clients) {
			updateGameState(lobbyId, sessionId, types.StatusAssigningPrompts)
		}

	case types.GotPrompt:
		lobby.gottenPrompts++
		if lobby.gottenPrompts == len(lobby.clients) {
			updateGameState(lobbyId, sessionId, types.StatusDrawing)

		}

	case types.AssignPromptsComplete:
		updateGameState(sessionId, lobbyId, types.StatusGettingPrompts)

	case types.SubmittedDrawing:
		lobby.submittedDrawings++
		if lobby.submittedDrawings == len(lobby.clients) {
			updateGameState(lobbyId, sessionId, types.StatusAllFinishedDrawing)

		}
	case types.EditLobbySettings:
		broadcastMessage(msg, lobbyId)
	}

}

func updateGameState(lobbyId, sessionId string, newState types.GameState) {
	lobbiesMutex.RLock()
	defer lobbiesMutex.RUnlock()

	if lobby, exists := lobbies[lobbyId]; exists {
		lobby.mutex.Lock()
		defer lobby.mutex.Unlock()

		lobby.gameState = newState
		broadcastMessage(types.Message{
			Type:      types.GameStateChanges,
			SessionId: sessionId,
			LobbyId:   lobbyId,
			Data:      newState,
		}, lobbyId)
	}
}

func broadcastMessage(msg types.Message, lobbyId string) {
	lobbiesMutex.RLock()
	defer lobbiesMutex.RUnlock()

	if lobby, exists := lobbies[lobbyId]; exists {
		lobby.mutex.RLock()
		defer lobby.mutex.RUnlock()

		message, _ := json.Marshal(msg)
		for _, client := range lobby.clients {
			select {
			case client.send <- message:
			default:
				close(client.send)
				delete(lobby.clients, msg.SessionId)
			}
		}
	}
}
