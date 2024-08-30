package handlers

import (
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/gorilla/websocket"
	"github.com/salvizj/Redraw/types"
)

var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

var clients = make(map[*websocket.Conn]bool)
var broadcastChannel = make(chan types.Message)

func WebSocketHandler(w http.ResponseWriter, r *http.Request) {
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		fmt.Println("Error while upgrading connection:", err)
		return
	}
	defer conn.Close()

	clients[conn] = true
	fmt.Println("Client connected")

	go ReadMessages(conn)

	for {
		_, message, err := conn.ReadMessage()
		if err != nil {
			fmt.Println("Error while reading message:", err)
			delete(clients, conn)
			break
		}

		var msg types.Message
		if err := json.Unmarshal(message, &msg); err != nil {
			fmt.Println("Error while unmarshalling message:", err)
			continue
		}

		broadcastChannel <- msg
	}
}

func ReadMessages(conn *websocket.Conn) {
	for msg := range broadcastChannel {
		for client := range clients {
			if err := client.WriteJSON(msg); err != nil {
				fmt.Println("Error while broadcasting message:", err)
				client.Close()
				delete(clients, client)
			}
		}
	}
}

func BroadcastMessages() {
	for msg := range broadcastChannel {
		for client := range clients {
			if err := client.WriteJSON(msg); err != nil {
				fmt.Println("Error while broadcasting message:", err)
				client.Close()
				delete(clients, client)
			}
		}
	}
}
