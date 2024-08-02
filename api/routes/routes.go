package routes

import (
	"net/http"
	"path/filepath"
)

// Determine MIME type based on file extension
func mimeTypeForFile(filePath string) string {
	ext := filepath.Ext(filePath)
	switch ext {
	case ".js":
		return "application/javascript"
	case ".css":
		return "text/css"
	case ".html":
		return "text/html"
	case ".png":
		return "image/png"
	case ".jpg", ".jpeg":
		return "image/jpeg"
	case ".svg":
		return "image/svg+xml"
	default:
		return "application/octet-stream"
	}
}

// Serve static files with correct MIME types
func serveStaticFiles(w http.ResponseWriter, r *http.Request) {
	filePath := "./frontend/dist" + r.URL.Path
	if mimeType := mimeTypeForFile(filePath); mimeType != "" {
		w.Header().Set("Content-Type", mimeType)
	}
	http.ServeFile(w, r, filePath)
}

// InitializeRoutes sets up the routes for serving the React app
func InitializeRoutes() {
	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		// Serve static files if they exist, otherwise serve index.html
		if r.URL.Path == "/" || r.URL.Path == "" || r.URL.Path == "/about" {
			http.ServeFile(w, r, "./frontend/dist/index.html")
		} else {
			serveStaticFiles(w, r)
		}
	})
}
