package vManDashboardsController

import (
	"Ticketing/packages/constants"
	models "VeeamManager/package/vManModels"
	"encoding/json"
	"io/ioutil"
	"log"
	"net/http"
	"strings"

	ctx "github.com/gorilla/context"
	"github.com/gorilla/mux"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

// GetUserDashboards - Get All dashboards related to a user
func GetUserDashboards(w http.ResponseWriter, r *http.Request) {

	w.Header().Set("content-type", "application/json")
	//ls := context.Get(r, vbemAPI.VbEntMgrContextKey).(vbemAPI.LogonSession)

	var rr models.ResponseResult
	var user models.User
	if ok := user.GetLoggedIn(ctx.Get(r, "jwtToken")); ok {
		e := bson.D{
			{Key: "ownerId", Value: user.Id},
		}
		// var modelType = models.Dashboard{}
		// res, err := models.FindAll(models.DashboardCollection, e, modelType.GetNewEmpty)
		res, err := models.FindAll(models.DashboardCollection, e)
		// log.Println("resssssssssssssssss ======>             ", res)
		if err != nil {
			log.Println("Find All Error ", err)
		}
		var dashboards []models.Dashboard
		for _, v := range res {
			var d models.Dashboard
			mr, err := bson.Marshal(v)
			if err != nil {
				continue
			}
			err = bson.Unmarshal(mr, &d)
			if err != nil {
				continue
			}
			d.Id = d.Id.(primitive.ObjectID).String()
			d.Id = strings.TrimLeft(strings.TrimRight(d.Id.(string), "\")"), "ObjectID(\"")
			dashboards = append(dashboards, d)
		}
		rr = models.ResponseResult{
			Error:  false,
			Result: dashboards,
		}

		_ = json.NewEncoder(w).Encode(rr)
		return

	}

	rr = models.ResponseResult{
		Error:  "Token is invalid!",
		Result: "",
	}
	_ = json.NewEncoder(w).Encode(rr)
	return

}

// GetADashboard - Get a dashboard
func GetADashboard(w http.ResponseWriter, r *http.Request) {

	w.Header().Set("content-type", "application/json")
	//ls := context.Get(r, vbemAPI.VbEntMgrContextKey).(vbemAPI.LogonSession)
	var rr models.ResponseResult
	objectID := models.GetObjectId(mux.Vars(r)["objectId"])

	var user models.User
	if ok := user.GetLoggedIn(ctx.Get(r, "jwtToken")); ok {
		e := bson.D{
			{Key: "ownerId", Value: user.Id},
			{Key: "_id", Value: objectID},
		}

		var dashboard models.Dashboard
		_, err := models.FindOne(models.DashboardCollection, e, &dashboard)

		if err != nil {
			rr = models.ResponseResult{
				Error:  "Can not get dashboard Info!",
				Result: "",
			}
			_ = json.NewEncoder(w).Encode(rr)
			return
		}

		e = bson.D{
			{Key: "dashboardId", Value: mux.Vars(r)["objectId"]},
		}

		var dashboardLayouts models.DashboardLayout
		_, _ = models.FindOne(models.DashboardLayoutCollection, e, &dashboardLayouts)

		// log.Printf("\n \n =============== %v  ========== \n \n", dashboardLayouts.Layouts)

		drr := models.DashboardReponseResult{
			Error:   false,
			Result:  dashboard,
			Layouts: dashboardLayouts.Layouts,
		}

		_ = json.NewEncoder(w).Encode(drr)
		return

	}

	rr = models.ResponseResult{
		Error:  "Token is invalid!",
		Result: "",
	}
	_ = json.NewEncoder(w).Encode(rr)
	return

}

// Create - Create a new dashboard
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
			Code:          constants.ErrCodeInsertOne,
			Message:       strings.Replace(constants.MsgErrorInsertOne, "%COLLECTION%", models.DashboardCollection, -1),
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

// UpdateDashboardLayout - update or store dashboard layouts
func UpdateDashboardLayout(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("content-type", "application/json")

	var user models.User

	if ok := user.GetLoggedIn(ctx.Get(r, "jwtToken")); !ok {
		res := models.ResponseResult{
			Error:  "Token is invalid!",
			Result: "",
		}
		_ = json.NewEncoder(w).Encode(res)
		return
	}

	var dashboardLayouts models.DashboardLayout
	var res models.ResponseResult

	body, _ := ioutil.ReadAll(r.Body)

	err := json.Unmarshal(body, &dashboardLayouts)

	if err != nil {
		res.Error = err.Error()
		_ = json.NewEncoder(w).Encode(res)
		return
	}

	// log.Println(models.GetObjectId(dashboardLayouts.DashboardID.(string)))

	if exist := dashboardLayouts.IsDashboardIDExist(); !exist {
		res = models.ResponseResult{
			Error:  "Invalid Dashboard Id!",
			Result: "",
		}
		_ = json.NewEncoder(w).Encode(res)
		return
	}

	if layoutExist := dashboardLayouts.IsDashboardLayoutExist(); !layoutExist {
		// Add new
		_, err := models.InsertOne(models.DashboardLayoutCollection, dashboardLayouts)
		if err != nil {
			res = models.ResponseResult{
				Error:  "Can not add layout!",
				Result: err,
			}
			_ = json.NewEncoder(w).Encode(res)
			return
		}
		res = models.ResponseResult{
			Error:  "",
			Result: dashboardLayouts,
		}
		_ = json.NewEncoder(w).Encode(res)
		return

	}

	// Update
	filter := bson.M{
		"dashboardId": bson.M{
			"$eq": dashboardLayouts.DashboardID,
		},
	}

	update := bson.M{
		"$set": bson.M{
			"layouts": dashboardLayouts.Layouts,
		},
	}

	_, err = models.UpdateOne(models.DashboardLayoutCollection, filter, update)
	if err != nil {
		res = models.ResponseResult{
			Error:  "Can not update layout!",
			Result: err,
		}
		_ = json.NewEncoder(w).Encode(res)
		return
	}

	res = models.ResponseResult{
		Error:  false,
		Result: dashboardLayouts,
	}
	_ = json.NewEncoder(w).Encode(res)
	return

}

// Delete - Delete a dashboard
func Delete(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("content-type", "application/json")

	var user models.User
	var dashboard models.Dashboard
	var rr models.ResponseResult

	objectID := models.GetObjectId(mux.Vars(r)["objectId"])

	if ok := user.GetLoggedIn(ctx.Get(r, "jwtToken")); !ok {
		rr = models.ResponseResult{
			Error:  "Token is invalid!",
			Result: "",
		}
		_ = json.NewEncoder(w).Encode(rr)
		return
	}

	filter := bson.D{
		{Key: "ownerId", Value: user.Id},
		{Key: "_id", Value: objectID},
	}

	_, err := models.FindOne(models.DashboardCollection, filter, &dashboard)
	if err != nil {
		rr = models.ResponseResult{
			Error:  "Can not get dashboard Info!",
			Result: "",
		}
		_ = json.NewEncoder(w).Encode(rr)
		return
	}

	filter = bson.D{
		{Key: "dashboardId", Value: mux.Vars(r)["objectId"]},
	}
	var dashboardLayouts models.DashboardLayout
	_, _ = models.FindOne(models.DashboardLayoutCollection, filter, &dashboardLayouts)

	msr, _ := bson.Marshal(dashboardLayouts.Layouts)
	var unmarshalledLayout map[string]interface{}
	_ = bson.Unmarshal(msr, &unmarshalledLayout)

	var wgIDs []string
	for _, element := range unmarshalledLayout {

		if pa, ok := element.(primitive.A); ok {
			valueMSI := []interface{}(pa)
			for _, e := range valueMSI {
				for i, w := range e.(map[string]interface{}) {
					if i == "i" {
						chk := false
						for _, wgID := range wgIDs {
							if wgID == w {
								chk = true
							}
						}
						if !chk {
							wgIDs = append(wgIDs, w.(string))
						}
					}
				}
			}
		}
	}

	// DELETE WIDGETS
	for _, wd := range wgIDs {
		filter = bson.D{
			{Key: "itemId", Value: wd},
		}
		_, _ = models.DeleteOne(models.WidgetCollection, filter)
	}

	// Delete Dashboard Layout
	filter = bson.D{
		{Key: "dashboardId", Value: mux.Vars(r)["objectId"]},
	}
	_, _ = models.DeleteOne(models.DashboardLayoutCollection, filter)

	// Delete Dashboard
	filter = bson.D{
		{Key: "_id", Value: objectID},
	}
	dr, err := models.DeleteOne(models.DashboardCollection, filter)

	if err != nil {
		rr = models.ResponseResult{
			Error:  "Can not delete dashboard! Layouts and widgets might not be accessible anymore.",
			Result: "",
		}
		_ = json.NewEncoder(w).Encode(rr)
		return
	}

	rr = models.ResponseResult{
		Error:  false,
		Result: dr,
	}
	_ = json.NewEncoder(w).Encode(rr)

	return

}

// UpdateTitle - Update dashboard title
func UpdateTitle(w http.ResponseWriter, r *http.Request) {

	w.Header().Set("content-type", "application/json")
	//ls := context.Get(r, vbemAPI.VbEntMgrContextKey).(vbemAPI.LogonSession)
	var rr models.ResponseResult
	objectID := models.GetObjectId(mux.Vars(r)["objectId"])

	var user models.User
	if ok := user.GetLoggedIn(ctx.Get(r, "jwtToken")); ok {
		e := bson.D{
			{Key: "ownerId", Value: user.Id},
			{Key: "_id", Value: objectID},
		}

		var dashboard models.Dashboard
		_, err := models.FindOne(models.DashboardCollection, e, &dashboard)

		if err != nil {
			rr = models.ResponseResult{
				Error:  "Can not get dashboard Info!",
				Result: "",
			}
			_ = json.NewEncoder(w).Encode(rr)
			return
		}

		var reqName models.Dashboard
		var res models.ResponseResult

		body, _ := ioutil.ReadAll(r.Body)
		err = json.Unmarshal(body, &reqName)

		if err != nil {
			res.Error = err.Error()
			_ = json.NewEncoder(w).Encode(res)
			return
		}

		// Update
		filter := bson.M{
			"_id": bson.M{
				"$eq": objectID,
			},
		}

		update := bson.M{
			"$set": bson.M{
				"name": reqName.Name,
			},
		}

		_, err = models.UpdateOne(models.DashboardCollection, filter, update)
		if err != nil {
			res = models.ResponseResult{
				Error:  "Can not Update layout!",
				Result: err,
			}
			_ = json.NewEncoder(w).Encode(res)
			return
		}

		dashboard.Name = reqName.Name
		res = models.ResponseResult{
			Error:  false,
			Result: dashboard,
		}
		_ = json.NewEncoder(w).Encode(res)
		return

	}

	rr = models.ResponseResult{
		Error:  "Token is invalid!",
		Result: "",
	}
	_ = json.NewEncoder(w).Encode(rr)
	return

}
