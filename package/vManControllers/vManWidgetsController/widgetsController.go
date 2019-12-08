package vManWidgetsController

import (
	models "VeeamManager/package/vManModels"
	"encoding/json"
	"net/http"

	ctx "github.com/gorilla/context"
	"github.com/gorilla/mux"
	"go.mongodb.org/mongo-driver/bson"
)

func GetWidgetInfo(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("content-type", "application/json")

	var rr models.ResponseResult
	objectID := mux.Vars(r)["objectId"]

	var user models.User
	if ok := user.GetLoggedIn(ctx.Get(r, "jwtToken")); ok {
		e := bson.D{
			{Key: "itemId", Value: objectID},
		}

		var widget models.Widget
		_, err := models.FindOne(models.WidgetCollection, e, &widget)

		if err != nil {
			rr = models.ResponseResult{
				Error:  "Can not get widget Info!",
				Result: "",
			}
			_ = json.NewEncoder(w).Encode(rr)
			return
		}

		rr = models.ResponseResult{
			Error:  false,
			Result: widget,
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
