package vManEntMgrController

import (
	"Ticketing/packages/models"
	"VeeamManager/package/vManModels"
	"VeeamManager/package/vbemAPI"
	"VeeamManager/package/vbemAPI/vbemCalls"
	"encoding/json"
	"github.com/gorilla/context"
	"net/http"
)

func BackupServers(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("content-type", "application/json")
	ls := context.Get(r, vbemAPI.VbEntMgrContextKey).(vbemAPI.LogonSession)

	refs, err := vbemCalls.BackupServers(ls.SessionId)

	vManModels.StoreOrUpdateBackupServers(refs)


	if err != nil {
		res := models.ResponseResult{
			Error:  true,
			Result: err.Error(),
		}
		_ = json.NewEncoder(w).Encode(res)
	}

	_ = json.NewEncoder(w).Encode(refs)

	return

}
