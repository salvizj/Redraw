package handlers

import (
	"encoding/json"
	"net/http"

	"github.com/salvizj/Redraw/types"
	"github.com/salvizj/Redraw/utils"
)

func JoinLobbyHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method == http.MethodPost {
		var data struct {
			Username string `json:"username"`
			LobbyId  string `json:"lobbyId"`
		}
		if err := json.NewDecoder(r.Body).Decode(&data); err != nil {
			http.Error(w, "Invalid request payload", http.StatusBadRequest)
			return
		}

		Role := types.RolePlayer
		SessionId, err := utils.CreateSession(data.LobbyId, data.Username, Role)
		if err != nil {
			http.Error(w, "Failed to create session", http.StatusInternalServerError)
			return
		}

		utils.SetSessionCookie(w, SessionId)

		w.WriteHeader(http.StatusOK)
		if err := json.NewEncoder(w).Encode("Joined room"); err != nil {
			http.Error(w, "Failed to encode response", http.StatusInternalServerError)
			return
		}
	} else {
		http.Error(w, "Invalid request method", http.StatusMethodNotAllowed)
	}
}
