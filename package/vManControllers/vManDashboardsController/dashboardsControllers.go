package vManDashboardsController

import (
	"VeeamManager/package/vManConstants"
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
			Code:          vManConstants.ErrCodeInsertOne,
			Message:       strings.Replace(vManConstants.MsgErrorInsertOne, "%COLLECTION%", models.DashboardCollection, -1),
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

// SaveDefaultDashboard - save default dash
// func SaveDefaultDashboard(w http.ResponseWriter, r *http.Request) {
// 	var rr models.ResponseResult
//
// 	w.Header().Set("content-type", "application/json")
// 	objectID := models.GetObjectId(mux.Vars(r)["objectId"])
//
// 	e := bson.D{
// 		{Key: "_id", Value: objectID},
// 	}
//
// 	var dashboard models.Dashboard
// 	_, err := models.FindOne(models.DashboardCollection, e, &dashboard)
//
// 	arr := [39]string{
// 		"col0f64276b0-1b61-11ea-a8bb-f93252122488",
// 		"col149f10a60-1b62-11ea-b35f-b560347bbb18",
// 		"col5b90e79a0-1b62-11ea-9ef3-1d118598db4c",
// 		"col266be6480-1b62-11ea-8285-4fe1dfd24c67",
// 		"col4998b9c70-1b62-11ea-bdfd-a30d0488dc89",
// 		"col37b924570-1b62-11ea-b3e5-11bfd74063f3",
// 		"col7273ec9c0-1b63-11ea-825a-074b1eef5e87",
// 		"col6fa7332a0-1b62-11ea-a9e8-3900536b089d",
// 		"col82c5dabb0-1b63-11ea-825a-074b1eef5e87",
// 		"col981dbcca0-1bce-11ea-8b08-e783983f5f97",
// 		"col10a1f2d380-1bce-11ea-b439-99d6886df4e6",
// 		"col11a65b0fa0-1bce-11ea-b439-99d6886df4e6",
// 		"col12ab062120-1bce-11ea-b439-99d6886df4e6",
// 		"col184a427130-1bcf-11ea-8502-83d5c1f903b3",
// 		"col13af722dd0-1bce-11ea-b439-99d6886df4e6",
// 		"col163679e5c0-1bcf-11ea-8502-83d5c1f903b3",
// 		"col173b55a430-1bcf-11ea-8502-83d5c1f903b3",
// 		"col1531e98830-1bcf-11ea-8502-83d5c1f903b3",
// 		"col142c5b90c0-1bcf-11ea-8502-83d5c1f903b3",
// 		"col194f61a140-1bcf-11ea-8502-83d5c1f903b3",
// 		"col21ce183a60-1be0-11ea-8fa0-734e8d4db990",
// 		"col20c979ac00-1be0-11ea-8fa0-734e8d4db990",
// 		"col25ef38d2f0-1be9-11ea-963e-b12360bab82f",
// 		"col26f454ceb0-1be9-11ea-963e-b12360bab82f",
// 		"col22637b54c0-1be1-11ea-8452-e717392d9fe9",
// 		"col321bbbc850-1bea-11ea-963e-b12360bab82f",
// 		"col24eaac6d00-1be9-11ea-963e-b12360bab82f",
// 		"col28ff730780-1be9-11ea-963e-b12360bab82f",
// 		"col23a52186c0-1be5-11ea-a878-e992ffe3cb59",
// 		"col27f96e0b50-1be9-11ea-963e-b12360bab82f",
// 		"col33216b7890-1bea-11ea-963e-b12360bab82f",
// 		"col2906cee120-1bea-11ea-963e-b12360bab82f",
// 		"col31162a0050-1bea-11ea-963e-b12360bab82f",
// 		"col300d821eb0-1bea-11ea-963e-b12360bab82f",
// 		"col342bb8f3e0-1bea-11ea-963e-b12360bab82f",
// 		"col37e15185b0-1e73-11ea-89ad-55f26a93feae",
// 		"col38f6345850-1f03-11ea-a820-9b0e2334a1fb",
// 		"col36026d7740-1e65-11ea-9219-17b6cd9085ba",
// 		"col3531afbf40-1bea-11ea-963e-b12360bab82f",
// 	}
//
// 	var widgets []interface{}
// 	for _, id := range arr {
// 		e := bson.D{
// 			{Key: "itemId", Value: id},
// 		}
// 		var widget models.Widget
// 		_, _ = models.FindOne(models.WidgetCollection, e, &widget)
// 		widgets = append(widgets, widget)
// 	}
//
// 	rr = models.ResponseResult{
// 		Error:  err,
// 		Result: widgets,
// 	}
// 	_ = json.NewEncoder(w).Encode(rr)
// 	return
// }
