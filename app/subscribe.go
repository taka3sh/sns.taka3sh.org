package app

import (
	"context"
	"io"
	"net/http"

	"firebase.google.com/go/messaging"
)

type SubscribeServer struct {
	Topic string
}

func (s SubscribeServer) getEndpointURL(token string) string {
	return "https://iid.googleapis.com/iid/v1/" + token + s.Topic
}

func (s SubscribeServer) subscribe(ctx context.Context, client *messaging.Client, token string) (response string, err error) {
	return client.SubscribeToTopic(ctx, []string{token}, topic)
}

func (s SubscribeServer) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	handleCors(w, r)

	ctx := context.Background()
	client := initializeAppDefault().Messaging(ctx)

	token := r.FormValue("token")
	if token == "" {
		http.Error(w, "token was empty", 403)
		return
	}

	response, err := s.subscribe(client, key, token)
	if err != nil {
		http.Error(w, err.Error(), 500)
		return
	}

	io.Copy(w, response)
}
