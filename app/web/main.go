package main

import (
	"os"
	"log"
	"net/http"
	"fmt"

	"google.golang.org/appengine"
)

func main() {
	port := os.Getenv("PORT")
	if port == "" {
					port = "8080"
					log.Printf("Defaulting to port %s", port)
	}

	log.Printf("Listening on port %s", port)
	log.Fatal(http.ListenAndServe(fmt.Sprintf(":%s", port), nil))
	appengine.Main()
}