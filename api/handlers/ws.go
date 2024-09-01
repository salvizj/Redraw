package handlers

import (
	"encoding/json"
	"fmt"
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

var clients = make(map[*websocket.Conn]bool)
var clientsMutex sync.Mutex

var broadcastChannel = make(chan types.Message)

func WebSocketHandler(w http.ResponseWriter, r *http.Request) {
	fmt.Println("WebSocketHandler: Starting connection upgrade")
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		fmt.Println("WebSocketHandler: Error while upgrading connection:", err)
		return
	}
	defer func() {
		fmt.Println("WebSocketHandler: Closing connection")
		conn.Close()
		removeClient(conn)
	}()

	addClient(conn)
	fmt.Println("WebSocketHandler: Client connected")

	go ReadMessages(conn)

	for {
		_, message, err := conn.ReadMessage()
		if err != nil {
			fmt.Println("WebSocketHandler: Error while reading message:", err)
			break
		}

		fmt.Println("WebSocketHandler: Message received:", string(message))

		var msg types.Message
		if err := json.Unmarshal(message, &msg); err != nil {
			fmt.Println("WebSocketHandler: Error while unmarshalling message:", err)
			continue
		}

		fmt.Println("WebSocketHandler: Broadcasting message:", msg)
		broadcastChannel <- msg
	}
}

func ReadMessages(conn *websocket.Conn) {
	fmt.Println("ReadMessages: Goroutine started for broadcasting messages")
	for msg := range broadcastChannel {
		clientsMutex.Lock()
		for client := range clients {
			fmt.Println("ReadMessages: Sending message to client")
			if err := client.WriteJSON(msg); err != nil {
				fmt.Println("ReadMessages: Error while broadcasting message:", err)
				client.Close()
				delete(clients, client)
			}
		}
		clientsMutex.Unlock()
	}
}

func addClient(conn *websocket.Conn) {
	clientsMutex.Lock()
	defer clientsMutex.Unlock()
	clients[conn] = true
	fmt.Println("addClient: Client added")
}

func removeClient(conn *websocket.Conn) {
	clientsMutex.Lock()
	defer clientsMutex.Unlock()
	delete(clients, conn)
	fmt.Println("removeClient: Client removed")
}

func BroadcastMessages() {
	fmt.Println("BroadcastMessages: Listening on broadcastChannel")
	for msg := range broadcastChannel {
		clientsMutex.Lock()
		for client := range clients {
			fmt.Println("BroadcastMessages: Sending message to client")
			if err := client.WriteJSON(msg); err != nil {
				fmt.Println("BroadcastMessages: Error while broadcasting message:", err)
				client.Close()
				delete(clients, client)
			}
		}
		clientsMutex.Unlock()
	}
}
