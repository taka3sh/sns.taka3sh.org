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

type uidVerifier struct {
	publicKeys map[string]string
}

func (v *uidVerifier) fetchKeys(client *http.Client) (err error) {
	resp, err := client.Get("https://www.googleapis.com/robot/v1/metadata/x509/securetoken@system.gserviceaccount.com")
	if err != nil {
		return
	}

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
	claims, ok := token.Claims.(jwt.StandardClaims)
	if !token.Valid || !ok {
		return
	}

	if err = claims.Valid(); err != nil {
		return
	}

	if !claims.VerifyAudience("sns-taka3sh-org-157419", true) {
		return errors.New("invalid aud")
	}

	return nil
}

func publish(client *http.Client, key string, payload map[string]string) (resp *http.Response, err error) {
	jsonStr, _ := json.Marshal(map[string]interface{}{
		"to":           "/topics/posts",
		"notification": payload,
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

	v := uidVerifier{}

	if err = v.fetchKeys(client); err != nil {
		http.Error(w, err.Error(), 500)
		return
	}

	if err = v.verify(r.FormValue("idToken")); err != nil {
		http.Error(w, err.Error(), 403)
		return
	}

	payload := map[string]string{
		"title": r.FormValue("title"),
		"text":  r.FormValue("body"),
	}
	resp, err := publish(client, key, payload)
	if err != nil {
		http.Error(w, err.Error(), 500)
		return
	}

	resp.Header.Add("Content-Type", resp.Header.Get("Content-Type"))
	io.Copy(w, resp.Body)
}
