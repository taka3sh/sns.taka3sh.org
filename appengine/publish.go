package appengine

import (
	"bytes"
	"crypto/x509"
	"encoding/json"
	"encoding/pem"
	"errors"
	"io"
	"io/ioutil"
	"net/http"

	"github.com/dgrijalva/jwt-go"

	"google.golang.org/appengine"
	"google.golang.org/appengine/urlfetch"
)

func fetchPublicKeys(client *http.Client) (map[string]string, error) {
	resp, err := client.Get("https://www.googleapis.com/robot/v1/metadata/x509/securetoken@system.gserviceaccount.com")
	if err != nil {
		return nil, err
	}

	data, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		return nil, err
	}

	var keys map[string]string
	err = json.Unmarshal(data, &keys)
	return keys, err
}

func validateUID(publicKeys map[string]string, idToken string) error {
	_, err := jwt.Parse(idToken, func(token *jwt.Token) (interface{}, error) {
		kid, ok := token.Header["kid"].(string)
		if !ok {
			return nil, errors.New("kid was not found")
		}

		certPEM, ok := publicKeys[kid]
		if !ok {
			return nil, errors.New("the corresponding public key was not found")
		}

		block, _ := pem.Decode([]byte(certPEM))

		cert, err := x509.ParseCertificate(block.Bytes)
		if err != nil {
			return nil, err
		}

		return cert.PublicKey, nil
	})

	return err
}

func publish(client *http.Client, key, title, text string) (resp *http.Response, err error) {
	jsonStr, _ := json.Marshal(map[string]interface{}{
		"to": "/topics/posts",
		"notification": map[string]string{
			"title": title,
			"text":  text,
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

	publicKeys, err := fetchPublicKeys(client)
	if err != nil {
		http.Error(w, err.Error(), 500)
	}

	if validateUID(publicKeys, r.FormValue("idToken")) != nil {
		http.Error(w, err.Error(), 403)
	}

	resp, err := publish(client, key, r.FormValue("title"), r.FormValue("body"))
	if err != nil {
		http.Error(w, err.Error(), 500)
		return
	}

	resp.Header.Add("Content-Type", resp.Header.Get("Content-Type"))
	io.Copy(w, resp.Body)
}
