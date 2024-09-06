package server

import (
	"fmt"
	"net/http"

	"github.com/gorilla/handlers"
	"github.com/salvizj/Redraw/api/routes"
	"github.com/salvizj/Redraw/db"
)

func StartServer() {
	db.Initialize()
	defer db.DB.Close()

	db.CreateTables()

	r := routes.InitializeRoutes()

	corsHandler := handlers.CORS(
		handlers.AllowedOrigins([]string{"*"}),
		handlers.AllowedMethods([]string{"GET", "POST", "PUT", "DELETE", "OPTIONS"}),
		handlers.AllowedHeaders([]string{"Content-Type", "Authorization"}),
	)(r)

	fmt.Println("Server is running on http://localhost:8080")
	if err := http.ListenAndServe(":8080", corsHandler); err != nil {
		fmt.Printf("Server failed to start: %s\n", err)
	}
}
