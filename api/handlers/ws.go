package handlers

import (
	"encoding/json"
	"fmt"
	"net/http"
	"sync"

	"github.com/gorilla/websocket"
	"github.com/salvizj/Redraw/types"
)

type Client struct {
	conn      *websocket.Conn
	sessionID string
}

var upgrader = websocket.Upgrader{}

var clients = make(map[*Client]bool)

var broadcast = make(chan types.Message)

// mutex to synchronize access to the clients map
var mutex = &sync.Mutex{}

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

		var message types.Message
		if err := json.Unmarshal(msg, &message); err != nil {
			fmt.Println("Error while unmarshalling message:", err)
			continue
		}

		switch message.Type {
		case types.Join:
			client.sessionID = message.SessionID
			broadcast <- types.Message{
				Type: types.Notification,
				Data: fmt.Sprintf("Client with session ID %s joined", client.sessionID),
			}
		case types.Leave:
			broadcast <- types.Message{
				Type: types.Notification,
				Data: fmt.Sprintf("Client with session ID %s left", client.sessionID),
			}
		case types.StartGame:
			broadcast <- types.Message{
				Type: types.GameStarted,
				Data: "The game has started!",
			}
		default:
			broadcast <- message
		}
	}
}

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
