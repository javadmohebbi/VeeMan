package vManChartsController

import (
	models "VeeamManager/package/vManModels"
	"encoding/json"
	"io/ioutil"
	"net/http"
	"time"

	ctx "github.com/gorilla/context"
	"go.mongodb.org/mongo-driver/bson"
)

// GetChartData - Get data related to a chart
func GetChartData(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("content-type", "application/json")

	var rr models.ResponseResult
	var user models.User
	if ok := user.GetLoggedIn(ctx.Get(r, "jwtToken")); !ok {
		rr = models.ResponseResult{
			Error:  "Token is invalid!",
			Result: "",
		}
		_ = json.NewEncoder(w).Encode(rr)
		return
	}

	var chartDatReq models.ChartDataRequest
	body, _ := ioutil.ReadAll(r.Body)

	// log.Println("-===================> ", string(body))

	err := json.Unmarshal(body, &chartDatReq)

	if err != nil {
		rr.Error = err.Error()
		_ = json.NewEncoder(w).Encode(rr)
		return
	}

	// log.Println(chartDatReq)
	dataFetchResult := chartDatReq.Get()
	_ = json.NewEncoder(w).Encode(dataFetchResult)
	return

}

// SetChartData - Set data related to a chart
func SetChartData(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("content-type", "application/json")

	var rr models.ResponseResult
	var user models.User
	if ok := user.GetLoggedIn(ctx.Get(r, "jwtToken")); !ok {
		rr = models.ResponseResult{
			Error:  "Token is invalid!",
			Result: "",
		}
		_ = json.NewEncoder(w).Encode(rr)
		return
	}

	var widget models.Widget
	body, _ := ioutil.ReadAll(r.Body)

	// log.Println("-===================> ", string(body))

	err := json.Unmarshal(body, &widget)

	if err != nil {
		rr.Error = err.Error()
		_ = json.NewEncoder(w).Encode(rr)
		return
	}

	widget.CreatedAt = time.Now()
	widget.UpdatedAt = time.Now()

	if exist := widget.IsWidgetExist(); !exist {
		// Add New
		_, err := models.InsertOne(models.WidgetCollection, widget)
		if err != nil {
			rr = models.ResponseResult{
				Error:  "Can not add widget!",
				Result: err,
			}
			_ = json.NewEncoder(w).Encode(rr)
			return
		}
		rr = models.ResponseResult{
			Error:  "",
			Result: widget,
		}
		_ = json.NewEncoder(w).Encode(rr)
		return
	}

	// Update
	// Update
	filter := bson.M{
		"itemId": bson.M{
			"$eq": widget.ItemID,
		},
	}

	update := bson.M{
		"$set": bson.M{
			"title":     widget.Title,
			"chartData": widget.ChartData,
			"updatedAt": time.Now(),
		},
	}

	_, err = models.UpdateOne(models.WidgetCollection, filter, update)
	if err != nil {
		rr = models.ResponseResult{
			Error:  "Can not update widget!",
			Result: err,
		}
		_ = json.NewEncoder(w).Encode(rr)
		return
	}

	// log.Println(chartDatReq)
	// dataFetchResult := chartDatReq.Get()
	_ = json.NewEncoder(w).Encode(widget)
	return
}
