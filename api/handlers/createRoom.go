package handlers

import (
	"encoding/json"
	"net/http"
)

func CreateRoomHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method == http.MethodPost {
		var data struct {
			Username string `json:"username"`
		}
		if err := json.NewDecoder(r.Body).Decode(&data); err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}
		// Handle room creation logic
		w.WriteHeader(http.StatusOK)
		json.NewEncoder(w).Encode("Room created")
	} else {
		http.Error(w, "Invalid request method", http.StatusMethodNotAllowed)
	}
}
