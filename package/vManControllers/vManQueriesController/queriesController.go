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
	"github.com/gorilla/mux"
	"go.mongodb.org/mongo-driver/bson"
)

// RunRawQuery - Run raw query and get result
func RunRawQuery(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("content-type", "application/json")

	ls := ctx.Get(r, vbemAPI.VbEntMgrContextKey).(vbemAPI.LogonSession)

	var rr models.ResponseResult

	var qs vbemAPI.QueryString
	var res models.ResponseResult

	body, _ := ioutil.ReadAll(r.Body)
	err := json.Unmarshal(body, &qs)

	if err != nil {
		res.Error = err.Error()
		_ = json.NewEncoder(w).Encode(res)
		return
	}

	refs, err := vbemCalls.RawQuery(ls.SessionId, qs.QueryString)

	if err != nil {
		log.Println(err)
		rr = models.ResponseResult{
			Error:  true,
			Result: err,
		}
		_ = json.NewEncoder(w).Encode(rr)
		return
	}

	var qr map[string]interface{}
	// var qr vbemAPI.QueryResponse
	err = json.Unmarshal(refs.Bytes(), &qr)

	// var rfs map[string]interface{}
	// msr, _ := json.Marshal(qr["QueryResult"])
	// err = json.Unmarshal(msr, &rfs)

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
		Error: false,
		// Result: rfs["Refs"],
		Result: qr,
	}
	_ = json.NewEncoder(w).Encode(rr)
	return
}

// SaveRawQuery - save query
func SaveRawQuery(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("content-type", "application/json")

	var rr models.ResponseResult
	var rq models.RawQuery

	body, _ := ioutil.ReadAll(r.Body)
	err := json.Unmarshal(body, &rq)

	if err != nil {
		rr.Error = err.Error()
		_ = json.NewEncoder(w).Encode(rr)
		return
	}

	resRq, err := rq.StoreOrUpdate()

	if err != nil {
		rr.Error = err.Error()
		_ = json.NewEncoder(w).Encode(rr)
		return
	}

	rr = models.ResponseResult{
		Error:  false,
		Result: resRq,
	}
	_ = json.NewEncoder(w).Encode(rr)
	return

}

// GetRawQuery - Get a Raw query based on UID
func GetRawQuery(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("content-type", "application/json")

	var rr models.ResponseResult
	objectID := mux.Vars(r)["objectId"]
	var user models.User

	if ok := user.GetLoggedIn(ctx.Get(r, "jwtToken")); ok {
		e := bson.D{
			{Key: "uid", Value: objectID},
		}

		var rq models.RawQuery
		_, err := models.FindOne(models.RawQueryCollection, e, &rq)

		if err != nil {
			rr = models.ResponseResult{
				Error:  "Can not get query Info!",
				Result: "",
			}
			_ = json.NewEncoder(w).Encode(rr)
			return
		}

		rr = models.ResponseResult{
			Error:  false,
			Result: rq,
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

// GetAllRawQueries - Get all Raw queries
func GetAllRawQueries(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("content-type", "application/json")

	var rr models.ResponseResult
	var user models.User

	if ok := user.GetLoggedIn(ctx.Get(r, "jwtToken")); ok {

		res, err := models.FindAll(models.RawQueryCollection, bson.D{})

		if err != nil {
			log.Println("Find All Error ", err)
		}

		var rqs []models.RawQuery

		for _, v := range res {
			var rq models.RawQuery
			mr, err := bson.Marshal(v)
			if err != nil {
				continue
			}
			err = bson.Unmarshal(mr, &rq)
			if err != nil {
				continue
			}
			rqs = append(rqs, rq)
		}
		rr = models.ResponseResult{
			Error:  false,
			Result: rqs,
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

// DeleteRawQuery - Delete a Raw query based on UID
func DeleteRawQuery(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("content-type", "application/json")

	var rr models.ResponseResult
	objectID := mux.Vars(r)["objectId"]
	var user models.User

	if ok := user.GetLoggedIn(ctx.Get(r, "jwtToken")); ok {
		filter := bson.D{
			{Key: "uid", Value: objectID},
		}

		dr, err := models.DeleteOne(models.RawQueryCollection, filter)

		if err != nil {
			rr = models.ResponseResult{
				Error:  "Can not delete query!",
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

	rr = models.ResponseResult{
		Error:  "Token is invalid!",
		Result: "",
	}
	_ = json.NewEncoder(w).Encode(rr)
	return

}
