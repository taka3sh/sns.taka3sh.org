package appengine

import "net/http"

func init() {
	http.HandleFunc("/subscribe/", handleSubscribe)
}

func handleCors(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
}
