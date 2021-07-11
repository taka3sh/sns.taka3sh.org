package sns

import (
	"net/http"

	"github.com/taka3sh/sns.taka3sh.org/functions"
)

func Publish(w http.ResponseWriter, r *http.Request) {
	handler := functions.PublishServer{Topic: "posts.dev"}
	handler.ServeHTTP(w, r)
}

func PublishDev(w http.ResponseWriter, r *http.Request) {
	handler := functions.PublishServer{Topic: "posts.dev"}
	handler.ServeHTTP(w, r)
}

func Subscribe(w http.ResponseWriter, r *http.Request) {
	handler := functions.SubscribeServer{Topic: "posts"}
	handler.ServeHTTP(w, r)
}

func SubscribeDev(w http.ResponseWriter, r *http.Request) {
	handler := functions.SubscribeServer{Topic: "posts.dev"}
	handler.ServeHTTP(w, r)
}
