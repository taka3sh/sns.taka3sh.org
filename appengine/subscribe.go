package appengine

import (
	"errors"
	"fmt"
	"net/http"
	"net/url"
	"strings"

	"golang.org/x/net/context"

	"google.golang.org/appengine"
	"google.golang.org/appengine/datastore"
	"google.golang.org/appengine/urlfetch"
)

type secret struct {
	Name  string
	Value string
}

func extractToken(r *http.Request) (token string, err error) {
	components := strings.Split(r.URL.Path, "/")
	if len(components) == 3 && components[2] != "" {
		token = components[2]
	} else {
		err = errors.New("invalid token")
	}
	return
}

func getServerKey(ctx context.Context) (string, error) {
	k := datastore.NewKey(ctx, "Secret", "fcmServerKey", 0, nil)
	e := new(secret)
	err := datastore.Get(ctx, k, e)
	return e.Value, err
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

	fmt.Fprint(w, resp.Status)
}
