package lobby

import (
	"encoding/json"
	"log"
	"net/http"

	"github.com/salvizj/Redraw/types"
	"github.com/salvizj/Redraw/utils"
)

func CreateLobbyHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Invalid request method", http.StatusMethodNotAllowed)
		return
	}

	var req types.CreateLobbyRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request payload", http.StatusBadRequest)
		return
	}
	defer r.Body.Close()

	if req.Username == "" {
		http.Error(w, "Username is required", http.StatusBadRequest)
		return
	}

	lobbySettings := types.LobbySettings{
		MaxPlayerCount:  10,
		DrawingTime:     30,
		PromptInputTime: 20,
	}

	lobbySettingsId, err := utils.CreateLobbySettings(lobbySettings)
	if err != nil {
		log.Printf("CreateLobbySettings error: %v", err)
		http.Error(w, "Failed to create lobby settings", http.StatusInternalServerError)
		return
	}

	lobby := types.Lobby{
		LobbySettingsId: lobbySettingsId,
	}

	lobbyId, err := utils.CreateLobby(lobby)
	if err != nil {
		log.Printf("CreateLobby error: %v", err)
		http.Error(w, "Failed to create lobby", http.StatusInternalServerError)
		return
	}
	currentState := string(types.StatusWaitingForPlayers)

	err = utils.CreateGameState(lobbyId, currentState)
	if err != nil {
		log.Printf("CreateGameState error: %v", err)
		http.Error(w, "Failed to create gameState settings", http.StatusInternalServerError)
		return
	}
	session := types.Session{
		Username: req.Username,
		LobbyId:  lobbyId,
		Role:     types.RoleLeader,
	}

	sessionId, err := utils.CreateSession(session)
	if err != nil {
		log.Printf("CreateSession error: %v", err)
		http.Error(w, "Failed to create session", http.StatusInternalServerError)
		return
	}

	utils.SetSessionCookie(w, sessionId)

	response := map[string]string{
		"lobbyId":   lobbyId,
		"sessionId": sessionId,
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(response)
}
