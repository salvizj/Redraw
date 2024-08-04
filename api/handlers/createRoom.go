package handlers

import (
	"encoding/json"
	"net/http"

	"github.com/salvizj/Redraw/utils"
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

        userId, err := utils.CreateUser(data.Username)
        if err != nil {
            http.Error(w, err.Error(), http.StatusInternalServerError)
            return
        }

        roomID, err := utils.CreateRoom(userId, 10) 
        if err != nil {
            http.Error(w, err.Error(), http.StatusInternalServerError)
            return
        }       

        roomUserID, err := utils.CreateRoomUser(roomID, userId, data.Username, "admin")
        if err != nil {
            http.Error(w, err.Error(), http.StatusInternalServerError)
            return
        }

        sessionID, err := utils.CreateSession(data.Username, userId, roomUserID)
        if err != nil {
            http.Error(w, err.Error(), http.StatusInternalServerError)
            return
        }
        utils.SetSessionCookie(w, sessionID)

        w.WriteHeader(http.StatusOK)
    } else {
        http.Error(w, "Invalid request method", http.StatusMethodNotAllowed)
    }
}
