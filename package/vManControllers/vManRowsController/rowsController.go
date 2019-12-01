package vManRowsController

import (
	"VeeamManager/package/vManModels"
	"VeeamManager/package/vbemAPI"
	"VeeamManager/package/vbemAPI/vbemCalls"
	"encoding/json"
	"log"
	"net/http"

	"github.com/gorilla/context"
)

func GetAll(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("content-type", "application/json")
	ls := context.Get(r, vbemAPI.VbEntMgrContextKey).(vbemAPI.LogonSession)
	refs, err := vbemCalls.BackupServers(ls.SessionId)

	if err != nil {
		log.Println("ctrl", err)
	}

	vManModels.StoreOrUpdateBackupServers(refs)

	var r4ui vManModels.RowsForUI
	r4ui.PrepareRowsForUI()

	_ = json.NewEncoder(w).Encode(r4ui)
	return

}
