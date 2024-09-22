package canvas

import (
	"encoding/json"
	"net/http"

	"github.com/salvizj/Redraw/types"
	"github.com/salvizj/Redraw/utils"
)

func CreateCanvasHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var req types.CreateCanvasRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Bad request: "+err.Error(), http.StatusBadRequest)
		return
	}
	defer r.Body.Close()

	cookie, err := r.Cookie("sessionId")
	if err != nil {
		http.Error(w, "Unauthorized: Session ID not found in cookies", http.StatusUnauthorized)
		return
	}
	sessionID := cookie.Value

	canvas := types.Canvas{
		CanvasId:   utils.GenerateUUID(),
		CanvasData: req.CanvasData,
		PromptId:   req.PromptId,
		SessionId:  sessionID,
		LobbyId:    req.LobbyID,
	}

	if err := utils.CreateCanvas(canvas); err != nil {
		http.Error(w, "Internal server error: Failed to create canvas: "+err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)

}
