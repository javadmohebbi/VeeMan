package vManStatisticsController

import (
	models "VeeamManager/package/vManModels"
	"VeeamManager/package/vbemAPI"
	"VeeamManager/package/vbemAPI/vbemCalls"
	"encoding/json"
	"net/http"

	"github.com/gorilla/context"
)

// GetSummaryOverview - Get Summary Overview
func GetSummaryOverview(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("content-type", "application/json")

	var rr models.ResponseResult
	var user models.User

	if ok := user.GetLoggedIn(context.Get(r, "jwtToken")); ok {
		ls := context.Get(r, vbemAPI.VbEntMgrContextKey).(vbemAPI.LogonSession)

		refs, err := vbemCalls.SummaryOverview(ls.SessionId)
		if err != nil {
			res := models.ResponseResult{
				Error:  true,
				Result: err.Error(),
			}
			_ = json.NewEncoder(w).Encode(res)
			return
		}

		_ = json.NewEncoder(w).Encode(refs)
		return
	}

	rr = models.ResponseResult{
		Error:  "Token is invalid!",
		Result: "",
	}
	_ = json.NewEncoder(w).Encode(rr)
	return

}
