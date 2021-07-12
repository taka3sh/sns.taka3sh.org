package functions

import (
	"context"
	"fmt"
	"net/http"

	firebase "firebase.google.com/go/v4"
	"firebase.google.com/go/v4/messaging"
)

type PublishServer struct {
	Topic string
}

func (s PublishServer) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	app, err := firebase.NewApp(context.Background(), nil)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}

	ctx := context.Background()

	authClient, err := app.Auth(ctx)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	if _, err := authClient.VerifyIDToken(ctx, r.FormValue("idToken")); err != nil {
		http.Error(w, err.Error(), http.StatusForbidden)
		return
	}

	messagingClient, err := app.Messaging(ctx)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	message := &messaging.Message{
		Data: map[string]string{
			"key": r.FormValue("key"),
		},
		Notification: &messaging.Notification{
			Title:    r.FormValue("title"),
			Body:     r.FormValue("body"),
			ImageURL: "/logo192.png",
		},
		Topic: s.Topic,
	}

	response, err := messagingClient.Send(ctx, message)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	fmt.Fprintln(w, "Successfully sent message:", response)
}
