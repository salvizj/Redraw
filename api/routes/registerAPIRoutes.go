package routes

import (
	"net/http"

	"github.com/salvizj/Redraw/api/handlers"
	"github.com/salvizj/Redraw/api/middleware"
)

func RegisterAPIRoutes(mux *http.ServeMux) {
	mux.Handle("/create-lobby", middleware.CORS(http.HandlerFunc(handlers.CreateLobbyHandler)))
	mux.Handle("/join-lobby", middleware.CORS(http.HandlerFunc(handlers.JoinLobbyHandler)))
	mux.Handle("/get-lobby-details", middleware.CORS(http.HandlerFunc(handlers.GetLobbyDetailsHandler)))
	mux.Handle("/get-user-details", middleware.CORS(http.HandlerFunc(handlers.GetUserDetailsHandler)))
	mux.Handle("/username-exist", middleware.CORS(http.HandlerFunc(handlers.UsernameExistHandler)))
	mux.Handle("/create-prompt", middleware.CORS(http.HandlerFunc(handlers.CreatePromptHandler)))
	mux.Handle("/get-prompt", middleware.CORS(http.HandlerFunc(handlers.GetPromptHandler)))
	mux.Handle("/edit-lobby-settings", middleware.CORS(http.HandlerFunc(handlers.EditLobbySettingsHandler)))
	mux.Handle("/create-canvas", middleware.CORS(http.HandlerFunc(handlers.CreateCanvasHandler)))
	mux.Handle("/get-canvas", middleware.CORS(http.HandlerFunc(handlers.GetCanvasHandler)))
	mux.Handle("/ws", middleware.CORS(http.HandlerFunc(handlers.WsHandler)))
}
