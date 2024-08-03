package handlers

import (
	"encoding/json"
	"net/http"
)

func JoinRoomHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method == http.MethodPost {
		var data struct {
			Username string `json:"username"`
			RoomID   string `json:"roomId"`
		}
		if err := json.NewDecoder(r.Body).Decode(&data); err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}
		// Handle room joining logic
		w.WriteHeader(http.StatusOK)
		json.NewEncoder(w).Encode("Joined room")
	} else {
		http.Error(w, "Invalid request method", http.StatusMethodNotAllowed)
	}
}
