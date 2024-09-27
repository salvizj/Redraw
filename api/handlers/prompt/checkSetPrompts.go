package prompt

import (
	"encoding/json"
	"log"
	"net/http"

	"github.com/salvizj/Redraw/types"
	"github.com/salvizj/Redraw/utils"
)

func CheckSetPromptsHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Invalid request method", http.StatusMethodNotAllowed)
		return
	}

	var req types.CheckSetPromptsRequest
	err := json.NewDecoder(r.Body).Decode(&req)
	if err != nil || req.LobbyId == "" || req.PlayerCount <= 0 {
		http.Error(w, "Invalid request body or missing lobbyId or playerCount", http.StatusBadRequest)
		return
	}

	err = utils.CheckSetPrompts(req.LobbyId, req.PlayerCount)
	if err != nil {
		log.Printf("Error checking if everyone submitted prompts: %v", err)
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(types.CheckSetPromptsResponse{
			Status:  "failed",
			Message: err.Error(),
		})
		return
	}
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(types.CheckSetPromptsResponse{
		Status:  "success",
		Message: "Everyones in lobby subbmited prompt",
	})
}
