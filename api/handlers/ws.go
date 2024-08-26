package handlers

import (
	"encoding/json"
	"fmt"
	"net/http"
	"sync"

	"github.com/gorilla/websocket"
)

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
var broadcast = make(chan []byte)

// mutex to synchronize access to the clients map
var mutex = &sync.Mutex{}

// WebSocketHandler handles WebSocket requests from clients
func WebSocketHandler(w http.ResponseWriter, r *http.Request) {
	// Upgrade initial GET request to a WebSocket
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

// ReadMsgs handles incoming messages from a WebSocket client
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

		// Handle session initialization or other types of messages
		var message map[string]string
		if err := json.Unmarshal(msg, &message); err != nil {
			fmt.Println("Error while unmarshalling message:", err)
			continue
		}

		if message["type"] == "join" {
			client.sessionID = message["sessionId"]
			joinMsg := fmt.Sprintf("Client with session ID %s joined", client.sessionID)
			fmt.Println(joinMsg)
			// Broadcast the join message to all clients
			broadcast <- []byte(joinMsg)
		} else {
			// Broadcast the received message to all clients
			broadcast <- msg
		}
	}
}

// BroadcastMsgs broadcasts messages to all connected clients
func BroadcastMsgs() {
	for msg := range broadcast {
		mutex.Lock()
		for client := range clients {
			err := client.conn.WriteMessage(websocket.TextMessage, msg)
			if err != nil {
				fmt.Println("Error while broadcasting message:", err)
				client.conn.Close()
				delete(clients, client)
			}
		}
		mutex.Unlock()
	}
}
