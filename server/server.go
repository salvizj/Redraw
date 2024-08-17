package server

import (
	"fmt"
	"net/http"

	"github.com/salvizj/Redraw/api/routes"
	"github.com/salvizj/Redraw/db"
)

func StartServer() {
    db.Initialize()
    defer db.DB.Close()

    db.CreateTables()

    r := routes.InitializeRoutes()

    fmt.Println("Server is running on http://localhost:8080")
    if err := http.ListenAndServe(":8080", r); err != nil {
        fmt.Printf("Server failed to start: %s\n", err)
    }
}
