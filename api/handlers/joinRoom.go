package handlers

import (
	"encoding/json"
	"net/http"

	"github.com/salvizj/Redraw/utils"
)

func JoinRoomHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method == http.MethodPost {
		var data struct {
			Username string `json:"username"`
			RoomUserId   string `json:"roomUserId"`
		}
		if err := json.NewDecoder(r.Body).Decode(&data); err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}

		exists, err := utils.RoomUserExists(data.RoomUserId)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		if !exists {
			http.Error(w, "Room does not exist", http.StatusNotFound)
			return
		}

		userId, err := utils.CreateUser(data.Username)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		roomUserId, err := utils.AddUserToRoomUser(data.RoomUserId, userId, data.Username)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		sessionId, err := utils.CreateSession(data.Username, userId, roomUserId)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		utils.SetSessionCookie(w, sessionId)

		w.WriteHeader(http.StatusOK)
		json.NewEncoder(w).Encode("Joined room")
	} else {
		http.Error(w, "InvalId request method", http.StatusMethodNotAllowed)
	}
}
