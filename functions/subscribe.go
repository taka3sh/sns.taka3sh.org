package functions

import (
	"context"
	"fmt"
	"net/http"

	firebase "firebase.google.com/go/v4"
)

type SubscribeServer struct {
	Topic string
}

func (s SubscribeServer) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	app, err := firebase.NewApp(context.Background(), nil)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	ctx := context.Background()

	client, err := app.Messaging(ctx)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	token := r.FormValue("token")
	if token == "" {
		http.Error(w, "token was empty", http.StatusForbidden)
		return
	}

	response, err := client.SubscribeToTopic(ctx, []string{token}, s.Topic)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	fmt.Fprintf(w, "Success: %d, Failure: %d", response.SuccessCount, response.FailureCount)
}
