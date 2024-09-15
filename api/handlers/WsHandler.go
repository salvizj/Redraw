package handlers

import (
	"encoding/json"
	"log"
	"net/http"
	"sync"

	"github.com/gorilla/websocket"
	"github.com/salvizj/Redraw/types"
)

var upgrader = websocket.Upgrader{}

var (
	connMap      = NewConnMap()
	connMapMutex sync.Mutex
)

type Client struct {
	conn      *websocket.Conn
	send      chan []byte
	sessionID string
	lobbyID   string
}

func NewClient(conn *websocket.Conn, sessionID, lobbyID string) *Client {
	return &Client{
		conn:      conn,
		send:      make(chan []byte),
		sessionID: sessionID,
		lobbyID:   lobbyID,
	}
}

type ConnMap struct {
	connections map[string]map[*Client]bool
	sessionMap  map[string]*Client
}

func NewConnMap() *ConnMap {
	return &ConnMap{
		connections: make(map[string]map[*Client]bool),
		sessionMap:  make(map[string]*Client),
	}
}

func (cm *ConnMap) AddClient(client *Client) {
	connMapMutex.Lock()
	defer connMapMutex.Unlock()

	if _, exists := cm.sessionMap[client.sessionID]; exists {
		return
	}

	if _, ok := cm.connections[client.lobbyID]; !ok {
		cm.connections[client.lobbyID] = make(map[*Client]bool)
	}

	cm.connections[client.lobbyID][client] = true
	cm.sessionMap[client.sessionID] = client
}

func (cm *ConnMap) RemoveClient(client *Client) {
	connMapMutex.Lock()
	defer connMapMutex.Unlock()

	if clients, ok := cm.connections[client.lobbyID]; ok {
		delete(clients, client)
		if len(clients) == 0 {
			delete(cm.connections, client.lobbyID)
		}
	}
	delete(cm.sessionMap, client.sessionID)
	client.conn.Close()
}

func (cm *ConnMap) Broadcast(message []byte, lobbyID string) {
	connMapMutex.Lock()
	defer connMapMutex.Unlock()

	if clients, ok := cm.connections[lobbyID]; ok {
		for client := range clients {
			select {
			case client.send <- message:
			default:
				log.Println("Failed to send message to client, removing it")
				cm.RemoveClient(client)
			}
		}
	}
}

func WsHandler(w http.ResponseWriter, r *http.Request) {
	sessionID := r.URL.Query().Get("sessionID")
	lobbyID := r.URL.Query().Get("lobbyID")
	if sessionID == "" || lobbyID == "" {
		http.Error(w, "Session ID and Lobby ID required", http.StatusBadRequest)
		return
	}

	connMapMutex.Lock()
	_, exists := connMap.sessionMap[sessionID]
	connMapMutex.Unlock()

	if exists {
		http.Error(w, "Client already connected", http.StatusForbidden)
		return
	}

	wsConn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Printf("Error during connection upgrade: %v", err)
		return
	}

	client := NewClient(wsConn, sessionID, lobbyID)

	connMap.AddClient(client)

	go ReadMessages(client)
	go SendMessages(client)
}

func ReadMessages(client *Client) {
	defer func() {
		connMap.RemoveClient(client)
	}()

	for {
		_, msgData, err := client.conn.ReadMessage()
		if err != nil {
			log.Printf("Error reading message from client %s: %v", client.sessionID, err)
			break
		}

		var msg types.Message
		err = json.Unmarshal(msgData, &msg)
		if err != nil {
			log.Printf("Error unmarshaling message: %v", err)
			continue
		}

		switch msg.Type {
		case types.Join:
			connMap.AddClient(client)
			broadcastMessage := []byte(`{"type": "join", "sessionId": "` + client.sessionID + `", "lobbyId": "` + client.lobbyID + `"}`)
			connMap.Broadcast(broadcastMessage, client.lobbyID)

		case types.StartGame:
			broadcastMessage := []byte(`{"type": "navigateToGame", "sessionId": "` + client.sessionID + `", "lobbyId": "` + client.lobbyID + `"}`)
			connMap.Broadcast(broadcastMessage, client.lobbyID)

		case types.EnteredGame:
			message, ok := msg.Data.(string)
			if !ok {
				log.Printf("Error: msg.Data is not a string")
				continue
			}
			broadcastMessage := []byte(`{
                "type": "` + string(types.EnteredGame) + `",
                "sessionId": "` + client.sessionID + `",
                "lobbyId": "` + client.lobbyID + `",
                "data": "` + message + `"
            }`)
			connMap.Broadcast(broadcastMessage, client.lobbyID)

		case types.GotPrompt:
			message, ok := msg.Data.(string)
			if !ok {
				log.Printf("Error: msg.Data is not a string")
				continue
			}
			broadcastMessage := []byte(`{
                "type": "` + string(types.GotPrompt) + `",
                "sessionId": "` + client.sessionID + `",
                "lobbyId": "` + client.lobbyID + `",
                "data": "` + message + `"
            }`)
			connMap.Broadcast(broadcastMessage, client.lobbyID)

		case types.SubmitedPrompt:
			message, ok := msg.Data.(string)
			if !ok {
				log.Printf("Error: msg.Data is not a string")
				continue
			}
			broadcastMessage := []byte(`{
                "type": "` + string(types.SubmitedPrompt) + `",
                "sessionId": "` + client.sessionID + `",
                "lobbyId": "` + client.lobbyID + `",
                "data": "` + message + `"
            }`)
			connMap.Broadcast(broadcastMessage, client.lobbyID)

		case types.RefetchLobbyDetails:
			broadcastMessage := []byte(`{
                "type": "` + string(types.RefetchLobbyDetails) + `",
                "sessionId": "` + client.sessionID + `",
                "lobbyId": "` + client.lobbyID + `"
            }`)
			connMap.Broadcast(broadcastMessage, client.lobbyID)

		default:
			log.Printf("Unknown message type: %s", msg.Type)
		}
	}
}

func SendMessages(client *Client) {
	for {
		msg, ok := <-client.send
		if !ok {
			return
		}

		err := client.conn.WriteMessage(websocket.TextMessage, msg)
		if err != nil {
			return
		}
	}
}
