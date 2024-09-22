package utils

import (
	"database/sql"
	"fmt"

	"github.com/salvizj/Redraw/db"
	"github.com/salvizj/Redraw/types"
)

func CreateCanvas(canvas types.Canvas) error {

	query := `INSERT INTO Canvas (CanvasId, SessionId, PromptId, CanvasData, LobbyId) VALUES (?, ?, ?, ?, ?)`

	fmt.Printf("Inserting into Canvas table: %v\n", canvas)

	_, err := db.DB.Exec(query,
		canvas.CanvasId,
		canvas.SessionId,
		canvas.PromptId,
		canvas.CanvasData,
		canvas.LobbyId,
	)

	if err != nil {
		fmt.Printf("Failed to execute query: %v\n", err)
		return fmt.Errorf("failed to create canvas: %w", err)
	}

	return nil
}
func GetCanvas(sessionId, lobbyId string) (types.Canvas, error) {
	var canvas types.Canvas

	query := `
		SELECT CanvasId, SessionId, PromptId, CanvasData, LobbyId, AssignedToSessionId
		FROM Canvas
		WHERE AssignedToSessionId = ? AND LobbyId = ?
		LIMIT 1`

	err := db.DB.QueryRow(query, sessionId, lobbyId).Scan(
		&canvas.CanvasId,
		&canvas.SessionId,
		&canvas.PromptId,
		&canvas.CanvasData,
		&canvas.LobbyId,
		&canvas.AssignedToSessionId,
	)

	if err != nil {
		if err == sql.ErrNoRows {
			return canvas, fmt.Errorf("no canvas found for AssignedToSessionId %s and LobbyId %s", sessionId, lobbyId)
		}
		return canvas, fmt.Errorf("failed to get canvas: %w", err)
	}

	return canvas, nil
}
