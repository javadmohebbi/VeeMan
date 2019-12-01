package vManEntMgrController

import (
	models "VeeamManager/package/vManModels"
	"VeeamManager/package/vbemAPI"
	"encoding/json"
	"github.com/gorilla/context"
	"net/http"
)

func CallAPI(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("content-type", "application/json")

	ls := context.Get(r, vbemAPI.VbEntMgrContextKey).(vbemAPI.LogonSession)


	res := models.ResponseResult{
		Error:  false,
		Result: ls,
	}

	_ = json.NewEncoder(w).Encode(res)
	return

}
