package appengine

import (
	"errors"
	"fmt"
	"net/http"
	"net/url"
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
	escapedToken := url.QueryEscape(token)
	return "https://iid.googleapis.com/iid/v1/" + escapedToken + "/rel/topics/posts"
}

func subscribe(client *http.Client, key string, token string) (resp *http.Response, err error) {
	req, err := http.NewRequest("POST", getEndpointURL(token), nil)
	if err == nil {
		req.Header.Add("Authorization", "key="+key)
		req.Header.Add("Content-Type", "application/json")
		resp, err = client.Do(req)
	}
	return
}

func handleSubscribe(w http.ResponseWriter, r *http.Request) {
	handleCors(w, r)

	ctx := appengine.NewContext(r)
	client := urlfetch.Client(ctx)

	key, err := getServerKey(ctx)
	if err != nil {
		http.Error(w, err.Error(), 500)
		return
	}

	token, err := extractToken(r)
	if err != nil {
		http.Error(w, err.Error(), 403)
		return
	}

	resp, err := subscribe(client, key, token)
	if err != nil {
		http.Error(w, err.Error(), 500)
		return
	}

	fmt.Fprint(w, resp.Status)
}