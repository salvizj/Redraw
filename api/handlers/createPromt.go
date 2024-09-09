package handlers

import (
	"encoding/json"
	"net/http"

	"github.com/salvizj/Redraw/types"
	"github.com/salvizj/Redraw/utils"
)

func CreatePromptHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Invalid request method", http.StatusMethodNotAllowed)
		return
	}

	var data types.Prompt

	if err := json.NewDecoder(r.Body).Decode(&data); err != nil {
		http.Error(w, "Invalid request payload", http.StatusBadRequest)
		return
	}

	if data.Prompt == "" || data.SessionId == "" || data.LobbyId == "" || data.Username == "" {
		http.Error(w, "Missing required fields", http.StatusBadRequest)
		return
	}

	err := utils.CreatePrompt(data)
	if err != nil {
		http.Error(w, "Failed to create prompt", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
}
