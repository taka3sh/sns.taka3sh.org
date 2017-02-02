package appengine

import (
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"

	"google.golang.org/appengine"
	"google.golang.org/appengine/urlfetch"
)

func publish(client *http.Client, key string) (resp *http.Response, err error) {
	jsonStr, _ := json.Marshal(map[string]interface{}{
		"to": "/topics/posts",
		"notification": map[string]string{
			"title": "The title",
			"text":  "The text",
		},
	})
	req, err := http.NewRequest("POST", "https://fcm.googleapis.com/fcm/send", bytes.NewBuffer(jsonStr))
	if err == nil {
		req.Header.Add("Authorization", "key="+key)
		req.Header.Add("Content-Type", "application/json")
		resp, err = client.Do(req)
	}
	return
}

func handlePublish(w http.ResponseWriter, r *http.Request) {
	handleCors(w, r)

	ctx := appengine.NewContext(r)
	client := urlfetch.Client(ctx)

	key, err := getServerKey(ctx)
	if err != nil {
		http.Error(w, err.Error(), 500)
		return
	}

	resp, err := publish(client, key)
	if err != nil {
		http.Error(w, err.Error(), 500)
		return
	}

	fmt.Fprint(w, resp.Status)
}
