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

var lobbies = make(map[string]map[*websocket.Conn]bool)

type Message struct {
	Type      string `json:"type"`
	SessionId string `json:"sessionId"`
	LobbyId   string `json:"lobbyId"`
	Content   string `json:"content"`
}

func WebSocketHandler(w http.ResponseWriter, r *http.Request) {
	ws, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Printf("Failed to upgrade to WebSocket: %v", err)
		return
	}
	defer ws.Close()

	var currentLobbyId string

	for {
		var msg Message
		err := ws.ReadJSON(&msg)
		if err != nil {
			log.Printf("Error reading JSON: %v", err)
			if currentLobbyId != "" {
				leaveLobby(currentLobbyId, ws)
			}
			break
		}

		if currentLobbyId == "" && msg.LobbyId != "" {
			currentLobbyId = msg.LobbyId
			joinLobby(currentLobbyId, ws)
		}

		switch msg.Type {
		case "start-game":
			handleStartGame(currentLobbyId)
		default:
			broadcastMessageToLobby(currentLobbyId, msg)
		}
	}
}

func joinLobby(lobbyId string, ws *websocket.Conn) {
	if lobbies[lobbyId] == nil {
		lobbies[lobbyId] = make(map[*websocket.Conn]bool)
	}
	lobbies[lobbyId][ws] = true
}

func leaveLobby(lobbyId string, ws *websocket.Conn) {
	if clients, ok := lobbies[lobbyId]; ok {
		delete(clients, ws)
		if len(clients) == 0 {
			delete(lobbies, lobbyId)
		}
	}
}

func handleStartGame(lobbyId string) {
	if clients, ok := lobbies[lobbyId]; ok {
		for client := range clients {
			err := client.WriteJSON(Message{
				Type:    "game-started",
				LobbyId: lobbyId,
				Content: "The game has started!",
			})
			if err != nil {
				log.Printf("Error sending game-started message: %v", err)
				client.Close()
				delete(clients, client)
				if len(clients) == 0 {
					delete(lobbies, lobbyId)
				}
			}
		}
	}
}

func broadcastMessageToLobby(lobbyId string, msg Message) {
	if clients, ok := lobbies[lobbyId]; ok {
		for client := range clients {
			err := client.WriteJSON(msg)
			if err != nil {
				log.Printf("Error broadcasting message: %v", err)
				client.Close()
				delete(clients, client)
				if len(clients) == 0 {
					delete(lobbies, lobbyId)
				}
			}
		}
	}
}
