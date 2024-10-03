package lobby

import (
	"encoding/json"
	"log"
	"net/http"

	"github.com/salvizj/Redraw/types"
	"github.com/salvizj/Redraw/utils"
)

func EditLobbySettingsHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPatch {
		http.Error(w, "Invalid request method", http.StatusMethodNotAllowed)
		log.Print("Invalid request method")
		return
	}

	var settings types.LobbySettings
	if err := json.NewDecoder(r.Body).Decode(&settings); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		log.Print("Error decoding request body: ", err)
		return
	}

	err := utils.EditLobbySettings(settings)
	if err != nil {
		http.Error(w, "Failed to edit lobby settings", http.StatusInternalServerError)
		log.Print("Error editing lobby settings: ", err)
		return
	}

	w.WriteHeader(http.StatusOK)
	response := map[string]string{"status": "success"}
	if err := json.NewEncoder(w).Encode(response); err != nil {
		http.Error(w, "Failed to encode response", http.StatusInternalServerError)
		log.Print("Error encoding response: ", err)
	}
}
