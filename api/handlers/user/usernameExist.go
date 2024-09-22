package handlers

import (
	"encoding/json"
	"net/http"

	"github.com/salvizj/Redraw/types"
	"github.com/salvizj/Redraw/utils"
)

func UsernameExistHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var requestData types.UsernameExistRequest
	if err := json.NewDecoder(r.Body).Decode(&requestData); err != nil {
		http.Error(w, "Bad request: "+err.Error(), http.StatusBadRequest)
		return
	}

	if requestData.Username == "" || requestData.LobbyID == "" {
		http.Error(w, "Bad request: Username and LobbyId are required", http.StatusBadRequest)
		return
	}

	exists, err := utils.UsernameExist(requestData.Username, requestData.LobbyID)
	if err != nil {
		http.Error(w, "Internal server error: Failed to check username: "+err.Error(), http.StatusInternalServerError)
		return
	}

	response := types.UsernameExistResponse{
		Exists:    exists,
		Available: !exists,
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)

	if err := json.NewEncoder(w).Encode(response); err != nil {
		http.Error(w, "Failed to encode response", http.StatusInternalServerError)
	}
}
