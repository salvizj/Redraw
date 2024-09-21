package routes

import (
	"net/http"
	"path/filepath"

	"github.com/salvizj/Redraw/api/handlers"
)

func InitializeRoutes() *http.ServeMux {
	mux := http.NewServeMux()

	RegisterAPIRoutes(mux)

	staticDir := "./frontend/dist/assets"
	mux.Handle("/assets/", http.StripPrefix("/assets/", handlers.ServeStaticFileHandler(staticDir)))

	mux.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		http.ServeFile(w, r, filepath.Join("./frontend/dist", "index.html"))
	})

	return mux
}
