package handlers

import (
	"encoding/json"
	"net/http"

	"github.com/salvizj/Redraw/types"
	"github.com/salvizj/Redraw/utils"
)

func CreateCanvasHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Invalid request method", http.StatusMethodNotAllowed)
		return
	}

	var data struct {
		Prompt     string `json:"prompt"`
		CanvasData string `json:"canvasData"`
		LobbyId    string `json:"lobbyId"`
	}

	if err := json.NewDecoder(r.Body).Decode(&data); err != nil {
		http.Error(w, "Invalid request payload", http.StatusBadRequest)
		return
	}

	cookie, err := r.Cookie("sessionId")
	if err != nil {
		http.Error(w, "Session ID not found in cookies", http.StatusUnauthorized)
		return
	}

	sessionId := cookie.Value

	canvas := types.Canvas{
		CanvasId:   utils.GenerateUUID(),
		CanvasData: data.CanvasData,
		Prompt:     data.Prompt,
		SessionId:  sessionId,
		LobbyId:    data.LobbyId,
	}

	err = utils.CreateCanvas(canvas)
	if err != nil {
		http.Error(w, "Failed to create canvas", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
}
