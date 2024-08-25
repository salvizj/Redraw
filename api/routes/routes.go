package routes

import (
	"net/http"

	"github.com/gorilla/mux"
	"github.com/salvizj/Redraw/api/handlers"
)

func InitializeRoutes() *mux.Router {
	r := mux.NewRouter()

	r.HandleFunc("/create-lobby", handlers.CreateLobbyHandler).Methods(http.MethodPost)
	r.HandleFunc("/join-lobby", handlers.JoinLobbyHandler).Methods(http.MethodPost)
	r.HandleFunc("/get-lobby-details", handlers.GetLobbyDetailsHandler).Methods(http.MethodGet)

	r.HandleFunc("/get-user-details", handlers.GetUserDetailsHandler).Methods(http.MethodGet)
	r.HandleFunc("/ws", handlers.WebSocketHandler)

	staticFileServer := http.FileServer(http.Dir("./frontend/dist"))
	r.PathPrefix("/").Handler(http.StripPrefix("/", staticFileServer))

	r.NotFoundHandler = http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		http.NotFound(w, r)
	})

	return r
}
