package handlers

import (
	"encoding/json"
	"net/http"

	"github.com/salvizj/Redraw/types"
	"github.com/salvizj/Redraw/utils"
)

func GetUserDetailsHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	cookie, err := r.Cookie("sessionId")
	if err != nil {
		http.Error(w, "Unauthorized: Session ID not found in cookies", http.StatusUnauthorized)
		return
	}
	sessionID := cookie.Value

	lobbyID, role, username, err := utils.GetLobbyAndUsers(sessionID)
	if err != nil {
		http.Error(w, "Failed to retrieve session information: "+err.Error(), http.StatusInternalServerError)
		return
	}

	response := types.UserDetailsResponse{
		SessionID: sessionID,
		LobbyID:   lobbyID,
		Role:      role,
		Username:  username,
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	if err := json.NewEncoder(w).Encode(response); err != nil {
		http.Error(w, "Failed to encode response", http.StatusInternalServerError)
	}
}
