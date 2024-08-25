package handlers

import (
	"log"
	"net/http"
	"time"

	"github.com/gorilla/websocket"
	"github.com/salvizj/Redraw/types"
)

var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

var lobbies = make(map[string]map[*websocket.Conn]bool)

func WebSocketHandler(w http.ResponseWriter, r *http.Request) {
	ws, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Printf("Failed to upgrade to WebSocket: %v", err)
		return
	}
	defer ws.Close()

	var currentLobbyId string

	go handlePing(ws)

	for {
		var msg types.Message
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

func handlePing(ws *websocket.Conn) {
	for {
		time.Sleep(10 * time.Second)
		if err := ws.WriteMessage(websocket.PingMessage, nil); err != nil {
			log.Printf("Error sending ping: %v", err)
			ws.Close()
			break
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
			err := client.WriteJSON(types.Message{
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

func broadcastMessageToLobby(lobbyId string, msg types.Message) {
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
