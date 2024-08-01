package main

import (
	"fmt"
	"net/http"

	"github.com/salvizj/Redraw/api/handlers"
	"github.com/salvizj/Redraw/db"
)

func main() {
    db.Initialize()
    defer db.DB.Close()
	db.CreateTables()
    http.HandleFunc("/hello", handlers.HelloHandler)
    http.HandleFunc("/", handlers.IndexHandler)
    fmt.Println("Server is running on http://localhost:8080")
    if err := http.ListenAndServe(":8080", nil); err != nil {
        fmt.Printf("Server failed to start: %s\n", err)
    }
}
