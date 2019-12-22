package vManRepositoriesController

import (
	models "VeeamManager/package/vManModels"
	"VeeamManager/package/vbemAPI"
	"VeeamManager/package/vbemAPI/vbemCalls"
	"log"

	"encoding/json"
	"net/http"

	ctx "github.com/gorilla/context"
	"github.com/gorilla/mux"
)

// GetRepositoriesRelatedToBackupServer - Get repos related to backup server
func GetRepositoriesRelatedToBackupServer(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("content-type", "application/json")

	ls := ctx.Get(r, vbemAPI.VbEntMgrContextKey).(vbemAPI.LogonSession)

	objectID := mux.Vars(r)["objectId"]

	var rr models.ResponseResult

	refs, err := vbemCalls.GetRepositoriesRelatedToBackupServer(objectID, ls.SessionId)

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
