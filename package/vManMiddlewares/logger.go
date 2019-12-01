package vManMiddlewares

import (
	"fmt"
	"log"
	"net/http"
	"time"
)

func HandleHttpLogs(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// Do stuff here
		l := fmt.Sprintf("client=%v,request=%v,method=%v,timestamp=%v", r.RemoteAddr, r.RequestURI, r.Method, time.Now().UnixNano())
		log.Println(l)

		// Call the next handler, which can be another middleware in the chain, or the final handler.
		next.ServeHTTP(w, r)
	})
}

