package handlers

import (
	"encoding/json"
	"fmt"
	"net/http"
	"sync"

	"github.com/gorilla/websocket"
)

// Message represents the structure of WebSocket messages
type Message struct {
	Type      string `json:"type"`
	SessionID string `json:"sessionId,omitempty"`
	Data      any    `json:"data,omitempty"` // Use `interface{}` for general-purpose data
}

// Client represents a WebSocket client
type Client struct {
	conn      *websocket.Conn
	sessionID string
}

// upgrader is used to upgrade HTTP connections to WebSocket connections
var upgrader = websocket.Upgrader{}

// clients holds all active WebSocket connections
var clients = make(map[*Client]bool)

// broadcast is a channel used to send messages to all connected clients
var broadcast = make(chan Message)

// mutex to synchronize access to the clients map
var mutex = &sync.Mutex{}

// WebSocketHandler handles WebSocket requests from clients
func WebSocketHandler(w http.ResponseWriter, r *http.Request) {
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		fmt.Println("Error while upgrading connection:", err)
		return
	}

	// Register the new client
	client := &Client{conn: conn}
	mutex.Lock()
	clients[client] = true
	mutex.Unlock()

	// Handle incoming messages
	go ReadMsgs(client)
}

func ReadMsgs(client *Client) {
	defer func() {
		client.conn.Close()
		mutex.Lock()
		delete(clients, client)
		mutex.Unlock()
	}()

	for {
		_, msg, err := client.conn.ReadMessage()
		if err != nil {
			fmt.Println("Error while reading message:", err)
			return
		}

		var message Message
		if err := json.Unmarshal(msg, &message); err != nil {
			fmt.Println("Error while unmarshalling message:", err)
			continue
		}

		switch message.Type {
		case "join":
			client.sessionID = message.SessionID
			broadcast <- Message{Type: "notification", Data: fmt.Sprintf("Client with session ID %s joined", client.sessionID)}
		case "leave":
			broadcast <- Message{Type: "notification", Data: fmt.Sprintf("Client with session ID %s left", client.sessionID)}
		case "startGame":
			broadcast <- Message{Type: "gameStarted", Data: "The game has started!"}
		default:
			broadcast <- message // Broadcast the message to all clients
		}
	}
}

// BroadcastMsgs broadcasts messages to all connected clients
func BroadcastMsgs() {
	for msg := range broadcast {
		mutex.Lock()
		for client := range clients {
			err := client.conn.WriteJSON(msg)
			if err != nil {
				fmt.Println("Error while broadcasting message:", err)
				client.conn.Close()
				delete(clients, client)
			}
		}
		mutex.Unlock()
	}
}
