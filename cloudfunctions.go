package snstaka3shorg

import (
	"net/http"

	"github.com/taka3sh/sns.taka3sh.org/packages/api"
)

func Publish(w http.ResponseWriter, r *http.Request) {
	api.Publish(w, r)
}

func PublishDev(w http.ResponseWriter, r *http.Request) {
	api.PublishDev(w, r)
}

func Subscribe(w http.ResponseWriter, r *http.Request) {
	api.Subscribe(w, r)
}

func SubscribeDev(w http.ResponseWriter, r *http.Request) {
	api.SubscribeDev(w, r)
}
