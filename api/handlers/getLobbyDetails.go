package handlers

import (
	"encoding/json"
	"net/http"

	"github.com/salvizj/Redraw/types"
	"github.com/salvizj/Redraw/utils"
)

func GetLobbyDetailsHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "Invalid request method", http.StatusMethodNotAllowed)
		return
	}

	cookie, err := r.Cookie("sessionId")
	if err != nil {
		http.Error(w, "Session ID not found in cookies", http.StatusUnauthorized)
		return
	}

	sessionId := cookie.Value

	lobbyId, role, username, err := utils.GetLobbyAndUserFromSession(sessionId)
	if err != nil {
		http.Error(w, "Failed to retrieve session information", http.StatusInternalServerError)
		return
	}

	players, err := utils.GetPlayersInLobby(lobbyId)
	if err != nil {
		http.Error(w, "Failed to retrieve players", http.StatusInternalServerError)
		return
	}
	lobbySettings, err := utils.GetLobbySettings(lobbyId)
	if err != nil {
		http.Error(w, "Failed to retrieve players", http.StatusInternalServerError)
		return

	}
	response := struct {
		LobbyId      string                `json:"lobbyId"`
		Players      []types.PlayerDetails `json:"players"`
		Role         string                `json:"role"`
		Username     string                `json:"username"`
		LobbySetings types.LobbySettings   `json:"lobbySettings"`
	}{
		LobbyId:      lobbyId,
		Players:      players,
		Role:         role,
		Username:     username,
		LobbySetings: lobbySettings,
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	if err := json.NewEncoder(w).Encode(response); err != nil {
		http.Error(w, "Failed to encode response", http.StatusInternalServerError)
	}
}
