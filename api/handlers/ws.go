package handlers

import (
    "log"
    "net/http"

    "github.com/gorilla/websocket"
)

var upgrader = websocket.Upgrader{
    CheckOrigin: func(r *http.Request) bool {
        return true
    },
}

var clients = make(map[*websocket.Conn]bool) 
var broadcast = make(chan Message)           

// Message defines the structure of messages sent over WebSocket
type Message struct {
    Type      string `json:"type"`
    SessionId string `json:"sessionId"`
    LobbyId   string `json:"lobbyId"`
    Content   string `json:"content"`
}

// WebSocketHandler handles WebSocket requests
func WebSocketHandler(w http.ResponseWriter, r *http.Request) {
    ws, err := upgrader.Upgrade(w, r, nil)
    if err != nil {
        log.Printf("Failed to upgrade to WebSocket: %v", err)
        return
    }
    defer ws.Close()

    clients[ws] = true

    for {
        var msg Message
        // Read in a new message as JSON and map it to a Message object
        err := ws.ReadJSON(&msg)
        if err != nil {
            log.Printf("Error reading JSON: %v", err)
            delete(clients, ws)
            break
        }

        if msg.Type == "start-game" {
            handleStartGame(msg.LobbyId)
        } else {
            // Broadcast message to all connected clients
            broadcast <- msg
        }
    }
}

func handleStartGame(lobbyId string) {

    for client := range clients {
        err := client.WriteJSON(Message{
            Type:    "game-started",
            LobbyId: lobbyId,
            Content: "The game has started!",
        })
        if err != nil {
            log.Printf("Error sending message: %v", err)
            client.Close()
            delete(clients, client)
        }
    }
}

func BroadcastMessages() {
    for {
        msg := <-broadcast
        for client := range clients {
            err := client.WriteJSON(msg)
            if err != nil {
                log.Printf("Error broadcasting message: %v", err)
                client.Close()
                delete(clients, client)
            }
        }
    }
}
