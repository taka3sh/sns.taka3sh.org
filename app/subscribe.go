package app

import (
	"context"
	"fmt"
	"net/http"

	firebase "firebase.google.com/go"
)

type SubscribeServer struct {
	Topic string
}

func (s SubscribeServer) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")

	app, err := firebase.NewApp(context.Background(), nil)
	if err != nil {
		http.Error(w, err.Error(), 500)
		return
	}

	ctx := context.Background()

	client, err := app.Messaging(ctx)
	if err != nil {
		http.Error(w, err.Error(), 500)
		return
	}

	token := r.FormValue("token")
	if token == "" {
		http.Error(w, "token was empty", 403)
		return
	}

	response, err := client.SubscribeToTopic(ctx, []string{token}, s.Topic)
	if err != nil {
		http.Error(w, err.Error(), 500)
		return
	}

	fmt.Fprintf(w, "Success: %d, Failure: %d", response.SuccessCount, response.FailureCount)
}
