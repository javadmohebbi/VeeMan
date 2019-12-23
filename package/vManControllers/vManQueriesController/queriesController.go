package vManQueriesController

import (
	models "VeeamManager/package/vManModels"
	"VeeamManager/package/vbemAPI"
	"VeeamManager/package/vbemAPI/vbemCalls"
	"io/ioutil"
	"log"

	"encoding/json"
	"net/http"

	ctx "github.com/gorilla/context"
)

// RunRawQuery - Run raw query and get result
func RunRawQuery(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("content-type", "application/json")

	ls := ctx.Get(r, vbemAPI.VbEntMgrContextKey).(vbemAPI.LogonSession)

	var rr models.ResponseResult

	var qwr vbemAPI.QueryWrapper
	var res models.ResponseResult

	body, _ := ioutil.ReadAll(r.Body)
	err := json.Unmarshal(body, &qwr)

	if err != nil {
		res.Error = err.Error()
		_ = json.NewEncoder(w).Encode(res)
		return
	}

	refs, err := vbemCalls.RawQuery(ls.SessionId, qwr)

	if err != nil {
		log.Println(err)
		rr = models.ResponseResult{
			Error:  true,
			Result: err,
		}
		_ = json.NewEncoder(w).Encode(rr)
		return
	}

	// var qr map[string]interface{}
	var qr vbemAPI.QueryResponse
	err = json.Unmarshal(refs.Bytes(), &qr)

	if err != nil {
		log.Println(err)
		rr = models.ResponseResult{
			Error:  true,
			Result: err,
		}
		_ = json.NewEncoder(w).Encode(rr)
		return
	}

	rr = models.ResponseResult{
		Error:  false,
		Result: qr,
	}
	_ = json.NewEncoder(w).Encode(rr)
	return
}
