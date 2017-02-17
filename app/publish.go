package app

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

type uidVerifier struct {
	publicKeys map[string]string
}

func (v *uidVerifier) fetchKeys(client *http.Client) (err error) {
	resp, err := client.Get("https://www.googleapis.com/robot/v1/metadata/x509/securetoken@system.gserviceaccount.com")
	if err != nil {
		return
	}
	defer resp.Body.Close()

	data, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		return
	}

	return json.Unmarshal(data, &v.publicKeys)
}

func (v *uidVerifier) parse(tokenString string) (*jwt.Token, error) {
	return jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		if token.Method.Alg() != "RS256" {
			return nil, errors.New("invalid algorithm")
		}

		kid, ok := token.Header["kid"].(string)
		if !ok {
			return nil, errors.New("kid was not found")
		}

		certString, ok := v.publicKeys[kid]
		if !ok {
			return nil, errors.New("the corresponding public key was not found")
		}

		block, _ := pem.Decode([]byte(certString))

		cert, err := x509.ParseCertificate(block.Bytes)
		if err != nil {
			return nil, err
		}

		return cert.PublicKey, nil
	})
}

func (v *uidVerifier) verify(tokenString string) (err error) {
	token, err := v.parse(tokenString)
	if err != nil {
		return
	} else if !token.Valid {
		return errors.New("invalid token")
	}

	claims, ok := token.Claims.(jwt.MapClaims)
	if !ok {
		return errors.New("malformed token")
	}

	if err = claims.Valid(); err != nil {
		return
	}

	if !claims.VerifyAudience("sns-taka3sh-org-157419", true) {
		return errors.New("invalid aud")
	}

	return nil
}

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

func handlePublish(w http.ResponseWriter, r *http.Request) {
	handleCors(w, r)

	ctx := appengine.NewContext(r)
	client := urlfetch.Client(ctx)

	v := uidVerifier{}
	if err := v.fetchKeys(client); err != nil {
		http.Error(w, err.Error(), 500)
		return
	}

	if err := v.verify(r.FormValue("idToken")); err != nil {
		http.Error(w, err.Error(), 403)
		return
	}

	key, err := getServerKey(ctx)
	if err != nil {
		http.Error(w, err.Error(), 500)
		return
	}

	payload, _ := json.Marshal(map[string]interface{}{
		"to": "/topics/posts",
		"notification": map[string]interface{}{
			"title": r.FormValue("title"),
			"body":  r.FormValue("body"),
			"icon":  "/icon.png",
		},
		"data": map[string]interface{}{
			"key": r.FormValue("key"),
		},
	})
	resp, err := publish(client, key, bytes.NewBuffer(payload))
	if err != nil {
		http.Error(w, err.Error(), 500)
		return
	}
	defer resp.Body.Close()

	w.Header().Set("Content-Type", resp.Header.Get("Content-Type"))
	w.WriteHeader(resp.StatusCode)
	io.Copy(w, resp.Body)
}
