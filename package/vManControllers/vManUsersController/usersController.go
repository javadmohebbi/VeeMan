package vManUsersController

import (
	constants "VeeamManager/package/vManConstants"
	models "VeeamManager/package/vManModels"
	"encoding/json"
	ctx "github.com/gorilla/context"
	"golang.org/x/crypto/bcrypt"
	"io/ioutil"
	"net/http"
	"strings"
)

/**
Register - Register user with default role
*/
func Register (w http.ResponseWriter, r *http.Request) {
	w.Header().Set("content-type", "application/json")

	var user models.User
	var res models.ResponseResult

	body, _ := ioutil.ReadAll(r.Body)
	err := json.Unmarshal(body, &user)

	if err != nil {
		res.Error = err.Error()
		_ = json.NewEncoder(w).Encode(res)
		return
	}

	if msg, validationResult := user.Valid(); !validationResult {
		res.Error = msg
		_ = json.NewEncoder(w).Encode(res)
		return
	}


	hash, err := bcrypt.GenerateFromPassword([]byte(user.Password), 10)
	if err != nil {
		re := models.ResponseError{
			Code:    constants.ErrCodeHashError,
			Message: constants.MsgHashError,
			OriginalError: err,
		}
		res.Error = re
		_ = json.NewEncoder(w).Encode(res)
		return
	}

	user.Password = string(hash)
	_, err = models.InsertOne(models.UserCollection, user)

	if err != nil {
		re := models.ResponseError{
			Code:    constants.ErrCodeInsertOne,
			Message: strings.Replace(constants.MsgErrorInsertOne, "%COLLECTION%", models.UserCollection, -1),
			OriginalError: err,
		}
		res.Error = re
		_ = json.NewEncoder(w).Encode(res)
		return
	}

	res.Error = false
	res.Result = strings.Replace(constants.MsgSuccessInsertedOne, "%COLLECTION%", models.UserCollection, -1)
	_ = json.NewEncoder(w).Encode(res)

	return

}

/**
Profile - Get User profile
*/
func Profile (w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	var user models.User

	if ok := user.GetLoggedIn(ctx.Get(r, "jwtToken")); ok {
		_ = json.NewEncoder(w).Encode(user)
			return
	} else {
		res := models.ResponseResult{
			Error:  "Token is invalid!",
			Result: "",
		}
		_ = json.NewEncoder(w).Encode(res)
		return
	}
	//if claims, ok := ctx.Get(r, "jwtToken").(jwt.MapClaims); ok {
	//	result.Id = claims["id"].(string)
	//	result.Email = claims["email"].(string)
	//	result.FirstName = claims["firstName"].(string)
	//	result.LastName = claims["lastName"].(string)
	//	result.Password = ""
	//	result.Token = ""
	//
	//	_ = json.NewEncoder(w).Encode(result)
	//	return
	//} else {
	//	res := models.ResponseResult{
	//		Error:  "Token is invalid!",
	//		Result: "",
	//	}
	//	_ = json.NewEncoder(w).Encode(res)
	//	return
	//}
}
