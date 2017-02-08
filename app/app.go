package app

import (
	"net/http"

	prerender "github.com/umireon/goprerender"

	"golang.org/x/net/context"

	"net/url"

	"google.golang.org/appengine/datastore"
)

type secret struct {
	Name  string
	Value string
}

func init() {
	http.HandleFunc("/subscribe/", handleSubscribe)
	http.HandleFunc("/publish", handlePublish)

	opt := prerender.Options{
		PrerenderURL: &url.URL{
			Scheme: "https",
			Host:   "service.prerender.io",
		},
		UsingAppEngine: true,
	}

	http.Handle("/", staticServer{
		handler:   http.FileServer(http.Dir("www")),
		prerender: opt.NewPrerender(),
	})
}

func handleCors(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
}

func getServerKey(ctx context.Context) (string, error) {
	k := datastore.NewKey(ctx, "Secret", "fcmServerKey", 0, nil)
	e := new(secret)
	err := datastore.Get(ctx, k, e)
	return e.Value, err
}
