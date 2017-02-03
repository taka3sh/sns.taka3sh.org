package appengine

import (
	"errors"
	"io"
	"net/http"
	"strings"

	"google.golang.org/appengine"
	"google.golang.org/appengine/urlfetch"
)

func extractToken(r *http.Request) (token string, err error) {
	components := strings.Split(r.URL.Path, "/")
	if len(components) == 3 && components[2] != "" {
		token = components[2]
	} else {
		err = errors.New("invalid token")
	}
	return
}

func getEndpointURL(token string) string {
	return "https://iid.googleapis.com/iid/v1/" + token + "/rel/topics/posts"
}

func subscribe(client *http.Client, key string, token string) (resp *http.Response, err error) {
	req, err := http.NewRequest("POST", getEndpointURL(token), nil)
	if err != nil {
		return
	}

	req.Header.Set("Authorization", "key="+key)
	req.Header.Set("Content-Type", "application/json")
	resp, err = client.Do(req)
	return
}

func handleSubscribe(w http.ResponseWriter, r *http.Request) {
	handleCors(w, r)

	ctx := appengine.NewContext(r)
	client := urlfetch.Client(ctx)

	token, err := extractToken(r)
	if err != nil {
		http.Error(w, err.Error(), 403)
		return
	}

	key, err := getServerKey(ctx)
	if err != nil {
		http.Error(w, err.Error(), 500)
		return
	}

	resp, err := subscribe(client, key, token)
	if err != nil {
		http.Error(w, err.Error(), 500)
		return
	}
	defer resp.Body.Close()

	resp.Header.Add("Content-Type", resp.Header.Get("Content-Type"))
	io.Copy(w, resp.Body)
}
