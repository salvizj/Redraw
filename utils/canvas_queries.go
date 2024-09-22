package utils

import (
	"database/sql"
	"fmt"

	"github.com/salvizj/Redraw/db"
	"github.com/salvizj/Redraw/types"
)

func CreateCanvas(canvas types.Canvas) error {

	query := `INSERT INTO Canvas (CanvasId, SessionId, Prompt, CanvasData, LobbyId) VALUES (?, ?, ?, ?, ?)`

	fmt.Printf("Inserting into Canvas table: %v\n", canvas)

	_, err := db.DB.Exec(query,
		canvas.CanvasId,
		canvas.SessionId,
		canvas.Prompt,
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
        SELECT c.CanvasId, c.CanvasData, c.Prompt, c.LobbyId
        FROM Canvas c
        WHERE c.LobbyId = ? AND c.SessionId != ?
        ORDER BY RANDOM()
        LIMIT 1
    `
	err := db.DB.QueryRow(query, lobbyId, sessionId).Scan(
		&canvas.CanvasId, &canvas.CanvasData, &canvas.Prompt, &canvas.LobbyId,
	)

	if err != nil {
		if err == sql.ErrNoRows {
			return canvas, fmt.Errorf("no available canvases for lobby %s excluding session %s", lobbyId, sessionId)
		}
		return canvas, fmt.Errorf("failed to get canvas: %w", err)
	}

	_, err = db.DB.Exec(`
        INSERT INTO CanvasAssignments (SessionId, CanvasId, PromptId)
        VALUES (?, ?, ?)
        ON CONFLICT (CanvasId) DO UPDATE SET SessionId = ?
    `, sessionId, canvas.CanvasId, canvas.Prompt, sessionId)

	if err != nil {
		return canvas, fmt.Errorf("failed to assign canvas: %w", err)
	}

	return canvas, nil
}
