package app

import (
	"context"
	"log"
	"net/http"

	"cloud.google.com/go/datastore"
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

func getServerKey() (string, error) {
	ctx := context.Background()

	dsClient, err := datastore.NewClient(ctx, "sns-taka3sh-org-157419")
	if err != nil {
		log.Fatal(err)
	}

	k := datastore.NameKey("Secret", "fcmServerKey", nil)
	e := new(secret)

	if err := dsClient.Get(ctx, k, e); err != nil {
		log.Fatal(err)
	}

	return e.Value, err
}
