package handlers

import (
	"encoding/json"
	"net/http"

	"github.com/salvizj/Redraw/types"
	"github.com/salvizj/Redraw/utils"
)

func GetPromptHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Invalid request method", http.StatusMethodNotAllowed)
		return
	}

	var data struct {
		SessionId string `json:"sessionId"`
		LobbyId   string `json:"lobbyId"`
	}

	err := json.NewDecoder(r.Body).Decode(&data)
	if err != nil {
		http.Error(w, "Failed to decode request body: "+err.Error(), http.StatusBadRequest)
		return
	}

	if data.SessionId == "" || data.LobbyId == "" {
		http.Error(w, "Missing sessionId or lobbyId in request body", http.StatusBadRequest)
		return
	}

	prompt, err := utils.GetPromptBySessionIdAndLobbyId(data.SessionId, data.LobbyId)
	if err != nil {
		http.Error(w, "Failed to get prompt: "+err.Error(), http.StatusInternalServerError)
		return
	}

	response := struct {
		Prompt types.Prompt `json:"prompt"`
	}{
		Prompt: prompt,
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	if err := json.NewEncoder(w).Encode(response); err != nil {
		http.Error(w, "Failed to encode response", http.StatusInternalServerError)
	}
}
