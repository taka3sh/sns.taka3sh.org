package functions

import (
	"bytes"
	"context"
	"fmt"
	"net/http"

	firebase "firebase.google.com/go/v4"
	"firebase.google.com/go/v4/messaging"
)

func publish(client *http.Client, key string, payload *bytes.Buffer) (resp *http.Response, err error) {
	req, err := http.NewRequest("POST", "https://fcm.googleapis.com/fcm/send", payload)
	if err != nil {
		return
	}

	req.Header.Set("Authorization", "key="+key)
	req.Header.Set("Content-Type", "application/json")
	resp, err = client.Do(req)
	return
}

type PublishServer struct {
	Topic string
}

func (s PublishServer) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")

	app, err := firebase.NewApp(context.Background(), nil)
	if err != nil {
		http.Error(w, err.Error(), 500)
	}

	ctx := context.Background()

	authClient, err := app.Auth(ctx)
	if err != nil {
		http.Error(w, err.Error(), 500)
		return
	}

	if _, err := authClient.VerifyIDToken(ctx, r.FormValue("idToken")); err != nil {
		http.Error(w, err.Error(), 403)
		return
	}

	messagingClient, err := app.Messaging(ctx)
	if err != nil {
		http.Error(w, err.Error(), 500)
		return
	}

	message := &messaging.Message{
		Data: map[string]string{
			"key": r.FormValue("key"),
		},
		Notification: &messaging.Notification{
			Title:    r.FormValue("title"),
			Body:     r.FormValue("body"),
			ImageURL: "/icon.png",
		},
		Topic: s.Topic,
	}

	response, err := messagingClient.Send(ctx, message)
	if err != nil {
		http.Error(w, err.Error(), 500)
		return
	}

	fmt.Fprintln(w, "Successfully sent message:", response)
}
