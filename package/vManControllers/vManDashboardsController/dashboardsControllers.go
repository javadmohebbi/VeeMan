package vManDashboardsController

import (
	"Ticketing/packages/constants"
	models "VeeamManager/package/vManModels"
	"encoding/json"
	ctx "github.com/gorilla/context"
	"github.com/gorilla/mux"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"io/ioutil"
	"log"
	"net/http"
	"strings"
)

func GetUserDashboards(w http.ResponseWriter, r *http.Request) {

	w.Header().Set("content-type", "application/json")
	//ls := context.Get(r, vbemAPI.VbEntMgrContextKey).(vbemAPI.LogonSession)

	var rr models.ResponseResult
	var user models.User
	if ok := user.GetLoggedIn(ctx.Get(r, "jwtToken")); ok {
		e := bson.D{
			{ Key: "ownerId", Value: user.Id, },
		}
		res, err := models.FineAll(models.DashboardCollection, e)

		if err != nil {
			log.Println(err)
		}
		var dashboards []models.Dashboard
		for _,v := range res {
			d := v.(models.Dashboard)
			d.Id = d.Id.(primitive.ObjectID).String()
			d.Id = strings.TrimLeft(strings.TrimRight(d.Id.(string),"\")"),"ObjectID(\"")
			dashboards = append(dashboards, d)
		}
		rr = models.ResponseResult{
			Error:  false,
			Result: dashboards,
		}

		_ = json.NewEncoder(w).Encode(rr)
		return


	} else {
		rr = models.ResponseResult{
			Error:  "Token is invalid!",
			Result: "",
		}
		_ = json.NewEncoder(w).Encode(rr)
		return
	}

}

func GetADashboards(w http.ResponseWriter, r *http.Request) {

	w.Header().Set("content-type", "application/json")
	//ls := context.Get(r, vbemAPI.VbEntMgrContextKey).(vbemAPI.LogonSession)
	var rr models.ResponseResult
	objectId :=  models.GetObjectId(mux.Vars(r)["objectId"])

	var user models.User
	if ok := user.GetLoggedIn(ctx.Get(r, "jwtToken")); ok {
		e := bson.D{
			{ Key: "ownerId", Value: user.Id, },
			{ Key: "_id", Value:  objectId, },
		}


		var dashboard models.Dashboard
		_, err := models.FineOne(models.DashboardCollection, e, &dashboard)

		if err != nil {
			log.Println(err)
		}


		rr = models.ResponseResult{
			Error:  false,
			Result: dashboard,
		}

		_ = json.NewEncoder(w).Encode(rr)
		return


	} else {
		rr = models.ResponseResult{
			Error:  "Token is invalid!",
			Result: "",
		}
		_ = json.NewEncoder(w).Encode(rr)
		return
	}

}

func Create(w http.ResponseWriter, r *http.Request) {

	w.Header().Set("content-type", "application/json")

	var user models.User
	var dashboard models.Dashboard
	var res models.ResponseResult

	body, _ := ioutil.ReadAll(r.Body)
	err := json.Unmarshal(body, &dashboard)

	if err != nil {
		res.Error = err.Error()
		_ = json.NewEncoder(w).Encode(res)
		return
	}
	dashboard.Id = primitive.NewObjectID()
	if ok := user.GetLoggedIn(ctx.Get(r, "jwtToken")); !ok {
		res := models.ResponseResult{
			Error:  "Token is invalid!",
			Result: "",
		}
		_ = json.NewEncoder(w).Encode(res)
		return
	}

	if msg, validationResult := dashboard.Valid(); !validationResult {
		res.Error = msg
		_ = json.NewEncoder(w).Encode(res)
		return
	}

	dashboard.OwnerId = user.Id
	ior, err := models.InsertOne(models.DashboardCollection, dashboard)




	if err != nil {
		re := models.ResponseError{
			Code:    constants.ErrCodeInsertOne,
			Message: strings.Replace(constants.MsgErrorInsertOne, "%COLLECTION%", models.DashboardCollection, -1),
			OriginalError: err,
		}
		res.Error = re
		_ = json.NewEncoder(w).Encode(res)
		return
	}

	res.Error = false
	//res.Result = strings.Replace(constants.MsgSuccessInsertedOne, "%COLLECTION%", models.DashboardCollection, -1)
	res.Result = ior.InsertedID
	_ = json.NewEncoder(w).Encode(res)

	return


}