package handlers

import (
	"fmt"
	"net/http"

	"github.com/gorilla/websocket"
)

var upgrader = websocket.Upgrader{}

func WebSocketHandler(w http.ResponseWriter, r *http.Request) {
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		fmt.Println("Error while upgrading connection:", err)
		return
	}
	defer conn.Close()

	for {
		_, msg, err := conn.ReadMessage()
		if err != nil {
			fmt.Println("Error while reading message:", err)
			break
		}
		fmt.Printf("Received message: %s\n", msg)

		err = conn.WriteMessage(websocket.TextMessage, []byte("Message received"))
		if err != nil {
			fmt.Println("Error while sending message:", err)
			break
		}
	}
}
