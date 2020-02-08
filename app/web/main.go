package main

import (
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/taka3sh/sns.taka3sh.org/app"

	"google.golang.org/appengine"
)

func main() {
	http.Handle("/subscribe", app.SubscribeServer{Topic: "/rel/topics/posts"})
	http.Handle("/subscribe.dev", app.SubscribeServer{Topic: "/rel/topics/posts.dev"})
	http.Handle("/publish", app.PublishServer{Topic: "/topics/posts"})
	http.Handle("/publish.dev", app.PublishServer{Topic: "/topics/posts.dev"})
	http.HandleFunc("/index.html", app.HandleIndex)

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
		log.Printf("Defaulting to port %s", port)
	}

	log.Printf("Listening on port %s", port)
	log.Fatal(http.ListenAndServe(fmt.Sprintf(":%s", port), nil))
	appengine.Main()
}
