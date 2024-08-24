package handlers

import (
	"encoding/json"
	"net/http"

	"github.com/salvizj/Redraw/types"
	"github.com/salvizj/Redraw/utils"
)

func CreateLobbyHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method == http.MethodPost {
		var data struct {
			Username string `json:"username"`
		}

		if err := json.NewDecoder(r.Body).Decode(&data); err != nil {
			http.Error(w, "Invalid request payload", http.StatusBadRequest)
			return
		}

		LobbySettingsId, err := utils.CreateLobbySettings()
		if err != nil {
			http.Error(w, "Failed to create lobby settings", http.StatusInternalServerError)
			return
		}
		LobbyId, err := utils.CreateLobby(LobbySettingsId)
		if err != nil {
			http.Error(w, "Failed to create lobby", http.StatusInternalServerError)
			return
		}
		Role := types.RoleLeader
		SessionId, err := utils.CreateSession(LobbyId, data.Username, Role)
		if err != nil {
			http.Error(w, "Failed to create session", http.StatusInternalServerError)
			return
		}

		utils.SetSessionCookie(w, SessionId)

		response := struct {
			LobbyId string `json:"lobbyId"`
		}{
			LobbyId: LobbyId,
		}

		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		if err := json.NewEncoder(w).Encode(response); err != nil {
			http.Error(w, "Failed to encode response", http.StatusInternalServerError)
			return
		}
	} else {
		http.Error(w, "Invalid request method", http.StatusMethodNotAllowed)
	}
}
