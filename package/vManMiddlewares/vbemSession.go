package vManMiddlewares

import (
	constants "VeeamManager/package/vManConstants"
	models "VeeamManager/package/vManModels"
	"VeeamManager/package/vbemAPI"
	"VeeamManager/package/vbemAPI/vbemAuth"
	"encoding/json"
	"github.com/gorilla/context"
	"log"
	"net/http"
)

func VbEntMgrLogonSession(next http.HandlerFunc) http.HandlerFunc {
	return http.HandlerFunc(func(w http.ResponseWriter, req *http.Request) {

		var ls vbemAPI.LogonSession

		ls = vbemAuth.ReadSession()

		if !vbemAuth.Validate(ls) {
			l, err := vbemAuth.Login()
			if err != nil {
				log.Println("Veeam Enterprise manager session is not valid ", err)
				re := models.ResponseError{
					Code:    constants.ErrCodeInvalidVeeamEntMgrLogonSession,
					Message: constants.MsgErrInvalidVeeamEntMgrLogonSession,
					OriginalError: nil,
				}
				res := models.ResponseResult{
					Error:  re,
					Result: nil,
				}
				_ = json.NewEncoder(w).Encode(res)
				return
			}
			ls = l
		}


		context.Set(req, vbemAPI.VbEntMgrContextKey, ls)
		next(w, req)


	})
}


func VbEntMgrLogonSessionMidWare(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, req *http.Request) {

		var ls vbemAPI.LogonSession

		ls = vbemAuth.ReadSession()

		if !vbemAuth.Validate(ls) {
			l, err := vbemAuth.Login()
			if err != nil {
				log.Println("Veeam Enterprise manager session is not valid ", err)
				re := models.ResponseError{
					Code:    constants.ErrCodeInvalidVeeamEntMgrLogonSession,
					Message: constants.MsgErrInvalidVeeamEntMgrLogonSession,
					OriginalError: nil,
				}
				res := models.ResponseResult{
					Error:  re,
					Result: nil,
				}
				_ = json.NewEncoder(w).Encode(res)
				return
			}
			ls = l
		}


		context.Set(req, vbemAPI.VbEntMgrContextKey, ls)
		next.ServeHTTP(w, req)


	})
}