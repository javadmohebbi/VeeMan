package vManJobsController

import (
	models "VeeamManager/package/vManModels"
	"VeeamManager/package/vbemAPI"
	"VeeamManager/package/vbemAPI/vbemCalls"
	"encoding/json"
	"log"
	"net/http"

	"github.com/gorilla/context"
	"go.mongodb.org/mongo-driver/bson"
)

// GetJobsDetail - store jobs detail in database
func GetJobsDetail(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("content-type", "application/json")

	// Login Session
	ls := context.Get(r, vbemAPI.VbEntMgrContextKey).(vbemAPI.LogonSession)

	var rr models.ResponseResult
	// var user models.User
	// if ok := user.GetLoggedIn(ctx.Get(r, "jwtToken")); !ok {
	// 	rr = models.ResponseResult{
	// 		Error:  "Token is invalid!",
	// 		Result: "",
	// 	}
	// 	_ = json.NewEncoder(w).Encode(rr)
	// 	return
	// }

	res, err := models.FindAll(models.JobsCollection, bson.D{})
	if err != nil {
		log.Println("Find All Error ", err)
	}

	var jbs []models.Job
	for _, jb := range res {
		var j models.Job
		mr, err := bson.Marshal(jb)
		if err != nil {
			continue
		}
		err = bson.Unmarshal(mr, &j)
		if err != nil {
			continue
		}
		jbs = append(jbs, j)
	}

	var refs []vbemAPI.Jobs

	// Send API Calls
	for _, job := range jbs {
		log.Println(" ===> Job ID ===> ", job.UID)

		refs, err = vbemCalls.GetJob(ls.SessionId, job.UID)
		log.Println(" ---- err  ---- ", err)
		log.Println(" ++++ Refs +++ ", refs)
	}

	rr = models.ResponseResult{
		Error:  "OOOOO BAYAD TOKEN USER RO RADIF KONAM",
		Result: refs,
	}
	_ = json.NewEncoder(w).Encode(rr)
	return

}
