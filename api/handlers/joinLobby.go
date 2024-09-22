package handlers

import (
	"encoding/json"
	"github.com/salvizj/Redraw/types"
	"github.com/salvizj/Redraw/utils"
	"log"
	"net/http"
)

type joinLobbyRequest struct {
	Username string `json:"username"`
	LobbyId  string `json:"lobbyId"`
}

func JoinLobbyHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Invalid request method", http.StatusMethodNotAllowed)
		return
	}

	var req joinLobbyRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request payload", http.StatusBadRequest)
		return
	}
	defer r.Body.Close()

	if req.Username == "" || req.LobbyId == "" {
		http.Error(w, "Username and LobbyId are required", http.StatusBadRequest)
		return
	}

	lobbyExists, err := utils.LobbyExists(req.LobbyId)
	if err != nil {
		log.Printf("Error checking lobby existence: %v", err)
		http.Error(w, "Failed to check lobby", http.StatusInternalServerError)
		return
	}
	if !lobbyExists {
		http.Error(w, "Lobby not found", http.StatusNotFound)
		return
	}

	isFull, err := utils.IsLobbyFull(req.LobbyId)
	if err != nil {
		log.Printf("Error checking if lobby is full: %v", err)
		http.Error(w, "Failed to check lobby capacity", http.StatusInternalServerError)
		return
	}
	if isFull {
		http.Error(w, "Lobby is full", http.StatusConflict)
		return
	}

	session := types.Session{
		Username: req.Username,
		LobbyId:  req.LobbyId,
		Role:     types.RolePlayer,
	}

	sessionId, err := utils.CreateSession(session)
	if err != nil {
		log.Printf("CreateSession error: %v", err)
		http.Error(w, "Failed to create session", http.StatusInternalServerError)
		return
	}

	utils.SetSessionCookie(w, sessionId)

	response := map[string]string{
		"sessionId": sessionId,
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(response)
}
