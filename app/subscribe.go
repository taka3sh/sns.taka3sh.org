package app

import (
	"io"
	"net/http"
)

type SubscribeServer struct {
	Topic string
}

func (s SubscribeServer) getEndpointURL(token string) string {
	return "https://iid.googleapis.com/iid/v1/" + token + s.Topic
}

func (s SubscribeServer) subscribe(client *http.Client, key string, token string) (resp *http.Response, err error) {
	req, err := http.NewRequest("POST", s.getEndpointURL(token), nil)
	if err != nil {
		return
	}

	req.Header.Set("Authorization", "key="+key)
	req.Header.Set("Content-Type", "application/json")
	resp, err = client.Do(req)
	return
}

func (s SubscribeServer) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	handleCors(w, r)

	client := &http.Client{}

	token := r.FormValue("token")
	if token == "" {
		http.Error(w, "token was empty", 403)
		return
	}

	key, err := getServerKey()
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
