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
	r.HandleFunc("/get-user-role", handlers.GetUserRoleHandler).Methods(http.MethodPost)
	
	staticFileServer := http.FileServer(http.Dir("./frontend/dist"))
	r.PathPrefix("/").Handler(http.StripPrefix("/", staticFileServer))

	// Custom 404 page
	r.NotFoundHandler = http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		http.NotFound(w, r)
	})

	return r
}