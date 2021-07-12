package sns

import (
	"net/http"

	"github.com/rs/cors"
	"github.com/taka3sh/sns.taka3sh.org/functions"
)

func handleCors(h http.Handler) http.Handler {
	c := cors.New(cors.Options{
		AllowedOrigins: []string{"https://sns.taka3sh.org", "https://*.netlify.app"},
	})
	return c.Handler(h)
}

func Publish(w http.ResponseWriter, r *http.Request) {
	handler := handleCors(functions.PublishServer{Topic: "posts.dev"})
	handler.ServeHTTP(w, r)
}

func PublishDev(w http.ResponseWriter, r *http.Request) {
	handler := handleCors(functions.PublishServer{Topic: "posts.dev"})
	handler.ServeHTTP(w, r)
}

func Subscribe(w http.ResponseWriter, r *http.Request) {
	handler := handleCors(functions.SubscribeServer{Topic: "posts"})
	handler.ServeHTTP(w, r)
}

func SubscribeDev(w http.ResponseWriter, r *http.Request) {
	handler := handleCors(functions.SubscribeServer{Topic: "posts.dev"})
	handler.ServeHTTP(w, r)
}
