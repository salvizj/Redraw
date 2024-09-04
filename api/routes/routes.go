package routes

import (
	"net/http"
	"path/filepath"

	"github.com/gorilla/mux"
	"github.com/salvizj/Redraw/api/handlers"
)

func InitializeRoutes() *mux.Router {
	r := mux.NewRouter()

	RegisterAPIRoutes(r)

	staticDir := "./frontend/dist/assets"
	r.PathPrefix("/assets/").Handler(http.StripPrefix("/assets/", handlers.ServeStaticFileHandler(staticDir)))

	r.PathPrefix("/").HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		http.ServeFile(w, r, filepath.Join("./frontend/dist", "index.html"))
	})

	return r
}
