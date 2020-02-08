package app

import (
	"net/http"

	"golang.org/x/net/context"

	"google.golang.org/appengine/datastore"
)

type secret struct {
	Name  string
	Value string
}

func HandleIndex(w http.ResponseWriter, r *http.Request) {
	http.Redirect(w, r, "/", 302)
}

func handleCors(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
}

func getServerKey(ctx context.Context) (string, error) {
	k := datastore.NewKey(ctx, "Secret", "fcmServerKey", 0, nil)
	e := new(secret)
	err := datastore.Get(ctx, k, e)
	return e.Value, err
}
