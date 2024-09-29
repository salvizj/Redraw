package routes

import (
	"net/http"

	canvasHandlers "github.com/salvizj/Redraw/api/handlers/canvas"
	lobbyHandlers "github.com/salvizj/Redraw/api/handlers/lobby"
	promptHandlers "github.com/salvizj/Redraw/api/handlers/prompt"
	userHandlers "github.com/salvizj/Redraw/api/handlers/user"
	"github.com/salvizj/Redraw/api/handlers/websocket"
	"github.com/salvizj/Redraw/api/middleware"
)

func RegisterAPIRoutes(mux *http.ServeMux) {
	// Lobby-related routes
	mux.Handle("/create-lobby", middleware.CORS(http.HandlerFunc(lobbyHandlers.CreateLobbyHandler)))
	mux.Handle("/join-lobby", middleware.CORS(http.HandlerFunc(lobbyHandlers.JoinLobbyHandler)))
	mux.Handle("/get-lobby-details", middleware.CORS(http.HandlerFunc(lobbyHandlers.GetLobbyDetailsHandler)))
	mux.Handle("/edit-lobby-settings", middleware.CORS(http.HandlerFunc(lobbyHandlers.EditLobbySettingsHandler)))

	// User-related routes
	mux.Handle("/get-user-details", middleware.CORS(http.HandlerFunc(userHandlers.GetUserDetailsHandler)))
	mux.Handle("/username-exist", middleware.CORS(http.HandlerFunc(userHandlers.UsernameExistHandler)))

	// Prompt-related routes
	mux.Handle("/create-prompt", middleware.CORS(http.HandlerFunc(promptHandlers.CreatePromptHandler)))
	mux.Handle("/get-prompt", middleware.CORS(http.HandlerFunc(promptHandlers.GetPromptHandler)))
	mux.Handle("/assign-prompt", middleware.CORS(http.HandlerFunc(promptHandlers.AssignPromptandler)))

	// Canvas-related routes
	mux.Handle("/create-canvas", middleware.CORS(http.HandlerFunc(canvasHandlers.CreateCanvasHandler)))
	mux.Handle("/get-canvas", middleware.CORS(http.HandlerFunc(canvasHandlers.GetCanvasHandler)))
	mux.Handle("/assign-canvas", middleware.CORS(http.HandlerFunc(canvasHandlers.AssignCanvasHandler)))

	// WebSocket route
	mux.Handle("/ws", middleware.CORS(http.HandlerFunc(websocket.WsHandler)))
}
