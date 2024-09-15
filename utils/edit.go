package utils

import (
	"fmt"

	"github.com/salvizj/Redraw/db"
	"github.com/salvizj/Redraw/types"
)

func EditLobbySettings(settings types.LobbySettings) error {
	query := `
		UPDATE LobbySettings
		SET MaxPlayerCount = ?, 
		    DrawingTime = ?, 
		    PromtInputTime = ?, 
		    LobbyStatus = ?
		WHERE LobbySettingsId = ?
	`

	_, err := db.DB.Exec(query,
		settings.MaxPlayerCount,
		settings.DrawingTime,
		settings.PromtInputTime,
		settings.LobbyStatus,
		settings.LobbySettingsId,
	)

	if err != nil {
		return fmt.Errorf("failed to update lobby settings: %w", err)
	}

	return nil
}
