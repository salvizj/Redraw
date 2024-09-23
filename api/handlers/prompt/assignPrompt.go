package prompt

import (
	"encoding/json"
	"net/http"

	"github.com/salvizj/Redraw/types"
	"github.com/salvizj/Redraw/utils"
)

func AssignPromptandler(w http.ResponseWriter, r *http.Request) {

	if r.Method != http.MethodPost {
		http.Error(w, "Invalid request method", http.StatusMethodNotAllowed)
		return
	}

	var req types.AssignPromptRequeststruct
	err := json.NewDecoder(r.Body).Decode(&req)
	if err != nil || req.LobbyId == "" {
		http.Error(w, "Invalid request body or missing lobbyId", http.StatusBadRequest)
		return
	}
	err = utils.AssignPrompt(req.LobbyId)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(types.AssignPromptResponse{
			Status:  "failed",
			Message: err.Error(),
		})
		return
	}
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(types.AssignPromptResponse{
		Status:  "success",
		Message: "Prompt assigned successfully",
	})
}
