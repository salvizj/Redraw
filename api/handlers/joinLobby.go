package handlers

import (
	"encoding/json"
	"net/http"

	"github.com/salvizj/Redraw/utils"
	"github.com/salvizj/Redraw/types"
)

func JoinLobbyHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method == http.MethodPost {
		var data struct {
			Username string `json:"username"`
			LobbyId string `json:"lobbyid"`
		}
		if err := json.NewDecoder(r.Body).Decode(&data); err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}

		Role := types.RolePlayer
        SessionId, err := utils.CreateSession(data.LobbyId, data.Username, Role)
        if err != nil {
            http.Error(w, err.Error(), http.StatusInternalServerError)
            return
        }

        utils.SetSessionCookie(w, SessionId)

		w.WriteHeader(http.StatusOK)
		json.NewEncoder(w).Encode("Joined room")
	} else {
		http.Error(w, "InvalId request method", http.StatusMethodNotAllowed)
	}
}
