package vManBackupServersController

import (
	models "VeeamManager/package/vManModels"
	"VeeamManager/package/vbemAPI"
	"VeeamManager/package/vbemAPI/vbemCalls"
	"log"

	"encoding/json"
	"net/http"

	ctx "github.com/gorilla/context"
)

// List - Get list of backup servers
func List(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("content-type", "application/json")

	var rr models.ResponseResult

	ls := ctx.Get(r, vbemAPI.VbEntMgrContextKey).(vbemAPI.LogonSession)

	refs, err := vbemCalls.BackupServers(ls.SessionId)
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
		Result: refs,
	}
	_ = json.NewEncoder(w).Encode(rr)
	return

}
