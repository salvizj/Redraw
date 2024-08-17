package handlers

import (
	"encoding/json"
	"net/http"

	"github.com/salvizj/Redraw/utils"
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

		LobbySettingsId, err := utils.GetLobbySettingsIdByLobbyId(data.LobbyId)
        if err != nil {
            http.Error(w, err.Error(), http.StatusInternalServerError)
            return
        }

        LobbyId, err := utils.JoinLobby(data.LobbyId, LobbySettingsId, data.Username, "Player")
        if err != nil {
            http.Error(w, err.Error(), http.StatusInternalServerError)
            return
        }

        SessionId, err := utils.CreateSession(LobbyId, data.Username, "Player")
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
