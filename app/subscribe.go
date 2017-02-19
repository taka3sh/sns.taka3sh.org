package app

import (
	"errors"
	"io"
	"net/http"
	"strings"

	"google.golang.org/appengine"
	"google.golang.org/appengine/urlfetch"
)

func (s subscribeServer) extractToken(r *http.Request) (token string, err error) {
	components := strings.Split(r.URL.Path, "/")
	if len(components) == 3 && components[2] != "" {
		token = components[2]
	} else {
		err = errors.New("invalid token")
	}
	return
}

func (s subscribeServer) getEndpointURL(token string) string {
	return "https://iid.googleapis.com/iid/v1/" + token + s.topic
}

func (s subscribeServer) subscribe(client *http.Client, key string, token string) (resp *http.Response, err error) {
	req, err := http.NewRequest("POST", s.getEndpointURL(token), nil)
	if err != nil {
		return
	}

	req.Header.Set("Authorization", "key="+key)
	req.Header.Set("Content-Type", "application/json")
	resp, err = client.Do(req)
	return
}

type subscribeServer struct {
	topic string
}

func (s subscribeServer) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	handleCors(w, r)

	ctx := appengine.NewContext(r)
	client := urlfetch.Client(ctx)

	token, err := s.extractToken(r)
	if err != nil {
		http.Error(w, err.Error(), 403)
		return
	}

	key, err := getServerKey(ctx)
	if err != nil {
		http.Error(w, err.Error(), 500)
		return
	}

	resp, err := s.subscribe(client, key, token)
	if err != nil {
		http.Error(w, err.Error(), 500)
		return
	}
	defer resp.Body.Close()

	w.Header().Set("Content-Type", resp.Header.Get("Content-Type"))
	w.WriteHeader(resp.StatusCode)
	io.Copy(w, resp.Body)
}
