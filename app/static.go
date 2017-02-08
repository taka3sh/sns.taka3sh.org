package app

import (
	"net/http"

	prerender "github.com/umireon/goprerender"
)

type staticServer struct {
	handler   http.Handler
	prerender *prerender.Prerender
}

func (s staticServer) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	if s.prerender.ShouldPrerender(r) {
		s.prerender.PreRenderHandler(w, r)
	} else {
		s.handler.ServeHTTP(w, r)
	}
}
