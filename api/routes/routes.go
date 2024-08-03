package routes

import (
	"net/http"

	"github.com/salvizj/Redraw/api/handlers" 
)

var staticRoutes = []string{
	"/",
	"/about",
}

var apiRoutes = map[string]http.HandlerFunc{
	"/create-room": handlers.CreateRoomHandler,
	"/join-room":   handlers.JoinRoomHandler,
}

func InitializeRoutes() {
	staticFileServer := http.FileServer(http.Dir("./frontend/dist"))

	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		// Check if the request path matches an API route
		if handler, found := apiRoutes[r.URL.Path]; found {
			handler.ServeHTTP(w, r)
			return
		}

		// Check if the request path is for the React app
		for _, route := range staticRoutes {
			if r.URL.Path == route {
				http.ServeFile(w, r, "./frontend/dist/index.html")
				return
			}
		}

		staticFileServer.ServeHTTP(w, r)
	})

	http.HandleFunc("/404", func(w http.ResponseWriter, r *http.Request) {
		http.NotFound(w, r)
	})
}
