package prompt

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

	var req types.Prompt

	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request payload", http.StatusBadRequest)
		return
	}

	if req.Prompt == "" || req.SessionId == "" || req.LobbyId == "" || req.Username == "" {
		http.Error(w, "Missing required fields", http.StatusBadRequest)
		return
	}

	err := utils.CreatePrompt(req)
	if err != nil {
		http.Error(w, "Failed to create prompt", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
}
