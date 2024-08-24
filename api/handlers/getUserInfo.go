package handlers

import (
	"encoding/json"
	"net/http"

	"github.com/salvizj/Redraw/utils"
)

func GetUserInfoHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method == http.MethodPost {
		var data struct {
			SessionId string `json:"sessionId"`
		}

		if err := json.NewDecoder(r.Body).Decode(&data); err != nil {
			http.Error(w, "Invalid request payload", http.StatusBadRequest)
			return
		}

		session, err := utils.GetSessionById(data.SessionId)
		if err != nil {
			http.Error(w, "Failed to retrieve session", http.StatusInternalServerError)
			return
		}

		lobbyId, err := utils.GetLobbyIdBySessionId(data.SessionId)
		if err != nil {
			http.Error(w, "Failed to retrieve lobby ID", http.StatusInternalServerError)
			return
		}

		response := struct {
			Role    string `json:"role"`
			LobbyId string `json:"lobbyId"`
		}{
			Role:    string(session.Role),
			LobbyId: lobbyId,
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
