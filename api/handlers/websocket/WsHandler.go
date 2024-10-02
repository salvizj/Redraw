package websocket

import (
	"encoding/json"
	"log"
	"net/http"

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
	ch   chan []byte
}

type Lobby struct {
	clients           map[string]*Client // key: sessionId
	gameState         types.GameState
	submittedPrompts  int
	gottenPrompts     int
	submittedDrawings int
}

var lobbies = make(map[string]*Lobby) // key: lobbyId

func WsHandler(w http.ResponseWriter, r *http.Request) {
	sessionId := r.URL.Query().Get("sessionId")
	lobbyId := r.URL.Query().Get("lobbyId")
	log.Printf("[WS] New connection attempt - Session ID: %s, Lobby ID: %s", sessionId, lobbyId)

	if sessionId == "" || lobbyId == "" {
		log.Printf("[WS] Connection rejected - missing sessionId or lobbyId")
		http.Error(w, "Session Id and Lobby Id required", http.StatusBadRequest)
		return
	}

	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Printf("[WS] Error during connection upgrade: %v", err)
		http.Error(w, "Could not upgrade connection", http.StatusInternalServerError)
		return
	}
	log.Printf("[WS] Connection successfully upgraded for Session ID: %s", sessionId)

	client := &Client{
		conn: conn,
		ch:   make(chan []byte, 1024),
	}

	lobby := joinLobby(client, sessionId, lobbyId)
	log.Printf("[WS] Client joined lobby - Session ID: %s, Lobby ID: %s, Total clients: %d", sessionId, lobbyId, len(lobby.clients))

	go readMessages(client, lobby, sessionId, lobbyId)
	go writeMessages(client)
}

func joinLobby(client *Client, sessionId, lobbyId string) *Lobby {
	if _, exists := lobbies[lobbyId]; !exists {
		log.Printf("[Lobby] Creating new lobby - Lobby ID: %s", lobbyId)
		lobbies[lobbyId] = &Lobby{
			clients:   make(map[string]*Client),
			gameState: types.StatusWaitingForPlayers,
		}
	}

	lobby := lobbies[lobbyId]
	lobby.clients[sessionId] = client

	log.Printf("[Lobby] Broadcasting join message - Session ID: %s, Lobby ID: %s", sessionId, lobbyId)
	broadcastMessage(types.Message{
		Type:      types.Join,
		SessionId: sessionId,
		LobbyId:   lobbyId,
	}, lobbyId)

	return lobby
}

func readMessages(client *Client, lobby *Lobby, sessionId, lobbyId string) {
	defer func() {
		log.Printf("[WS] Client disconnecting - Session ID: %s, Lobby ID: %s", sessionId, lobbyId)
		leaveLobby(sessionId, lobbyId)
		client.conn.Close()
	}()

	for {
		_, message, err := client.conn.ReadMessage()
		if err != nil {
			if websocket.IsUnexpectedCloseError(err, websocket.CloseGoingAway, websocket.CloseAbnormalClosure) {
				log.Printf("[WS] Unexpected close error: %v", err)
			} else {
				log.Printf("[WS] Connection closed normally - Session ID: %s", sessionId)
			}
			break
		}

		var msg types.Message
		if err := json.Unmarshal(message, &msg); err != nil {
			log.Printf("[WS] Error unmarshaling message: %v", err)
			continue
		}
		log.Printf("[WS] Received message - Type: %s, Session ID: %s", msg.Type, sessionId)

		handleMessage(msg, lobbyId, sessionId, lobby)
	}
}

func writeMessages(client *Client) {
	defer client.conn.Close()

	for message := range client.ch {
		err := client.conn.WriteMessage(websocket.TextMessage, message)
		if err != nil {
			return
		}
	}
}

func leaveLobby(sessionId, lobbyId string) {
	if lobby, exists := lobbies[lobbyId]; exists {
		delete(lobby.clients, sessionId)
		if len(lobby.clients) == 0 {
			delete(lobbies, lobbyId)
		}
	}
}

func handleMessage(msg types.Message, lobbyId, sessionId string, lobby *Lobby) {
	log.Printf("[Handler] Processing message - Type: %s, Session ID: %s, Lobby ID: %s", msg.Type, sessionId, lobbyId)
	switch msg.Type {
	case types.Join:
		log.Printf("[Game] Player joined - Session ID: %s, Lobby ID: %s", sessionId, lobbyId)
		broadcastMessage(msg, lobbyId)

	case types.StartGame:
		log.Printf("[Game] Game starting - Lobby ID: %s", lobbyId)
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
	if lobby, exists := lobbies[lobbyId]; exists {
		lobby.gameState = newState
		log.Print("Updated game state")
		broadcastMessage(types.Message{
			Type:      types.GameStateChanges,
			SessionId: sessionId,
			LobbyId:   lobbyId,
			Data:      newState,
		}, lobbyId)
	}
}

func broadcastMessage(msg types.Message, lobbyId string) {
	if lobby, exists := lobbies[lobbyId]; exists {
		message, _ := json.Marshal(msg)
		for _, client := range lobby.clients {
			select {
			case client.ch <- message:
			default:
				log.Print("closes client ch")
				close(client.ch)
				delete(lobby.clients, msg.SessionId)
			}
		}
	}
}
