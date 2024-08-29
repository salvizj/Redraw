package routes

import (
	"mime"
	"net/http"
	"path/filepath"

	"github.com/gorilla/mux"
	"github.com/salvizj/Redraw/api/handlers"
)

func InitializeRoutes() *mux.Router {
	r := mux.NewRouter()

	// API routes
	r.HandleFunc("/create-lobby", handlers.CreateLobbyHandler).Methods(http.MethodPost)
	r.HandleFunc("/join-lobby", handlers.JoinLobbyHandler).Methods(http.MethodPost)
	r.HandleFunc("/get-lobby-details", handlers.GetLobbyDetailsHandler).Methods(http.MethodGet)
	r.HandleFunc("/get-user-details", handlers.GetUserDetailsHandler).Methods(http.MethodGet)
	r.HandleFunc("/ws", handlers.WebSocketHandler)

	r.PathPrefix("/assets/").Handler(http.StripPrefix("/assets/", http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		ext := filepath.Ext(r.URL.Path)
		mimeType := mime.TypeByExtension(ext)
		if mimeType != "" {
			w.Header().Set("Content-Type", mimeType)
		}
		http.ServeFile(w, r, filepath.Join("./frontend/dist/assets", r.URL.Path))
	})))

	r.PathPrefix("/").HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		http.ServeFile(w, r, filepath.Join("./frontend/dist", "index.html"))
	})

	return r
}
