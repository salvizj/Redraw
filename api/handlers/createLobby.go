package handlers

import (
	"encoding/json"
	"net/http"

	"github.com/salvizj/Redraw/utils"
)

func CreateLobbyHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method == http.MethodPost {
		var data struct {
			Username string `json:"username"`
		}

		if err := json.NewDecoder(r.Body).Decode(&data); err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}

		LobbySettingsId, err := utils.CreateLobbySettings()
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		LobbyId, err := utils.CreateLobby(LobbySettingsId, data.Username, "Admin")
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		SessionId, err := utils.CreateSession(LobbyId, data.Username, "Admin")
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
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
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
	} else {
		http.Error(w, "Invalid request method", http.StatusMethodNotAllowed)
	}
}
