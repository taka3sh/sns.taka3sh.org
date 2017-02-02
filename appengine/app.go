package appengine

import "net/http"

func init() {
	http.HandleFunc("/subscribe/", handleSubscribe)
}
