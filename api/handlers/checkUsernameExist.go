package handlers

import (
	"encoding/json"
	"net/http"

	"github.com/salvizj/Redraw/utils"
)

func CheckUsernameExistHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Invalid request method", http.StatusMethodNotAllowed)
		return
	}

	var requestData struct {
		Username string `json:"username"`
		LobbyId  string `json:"lobbyId"`
	}

	if err := json.NewDecoder(r.Body).Decode(&requestData); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	if requestData.Username == "" || requestData.LobbyId == "" {
		http.Error(w, "Username and LobbyId are required", http.StatusBadRequest)
		return
	}

	exists, err := utils.CheckUsernameExist(requestData.Username, requestData.LobbyId)
	if err != nil {
		http.Error(w, "Failed to check username", http.StatusInternalServerError)
		return
	}

	response := struct {
		Exists    bool `json:"exists"`
		Available bool `json:"available"`
	}{
		Exists:    exists,
		Available: !exists,
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)

	if err := json.NewEncoder(w).Encode(response); err != nil {
		http.Error(w, "Failed to encode response", http.StatusInternalServerError)
	}
}
