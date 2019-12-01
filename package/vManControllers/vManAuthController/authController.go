package vManAuthController

import (
	constants "VeeamManager/package/vManConstants"
	models "VeeamManager/package/vManModels"
	"encoding/json"
	"github.com/dgrijalva/jwt-go"
	"go.mongodb.org/mongo-driver/bson"
	"golang.org/x/crypto/bcrypt"
	"io/ioutil"
	"net/http"
	"time"
)

func Login(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	var user models.User
	var res models.ResponseResult

	body, _ := ioutil.ReadAll(r.Body)
	err := json.Unmarshal(body, &user)

	if err != nil {
		res.Error = err.Error()
		_ = json.NewEncoder(w).Encode(res)
		return
	}

	var result models.User
	filter := bson.D{
		{ Key: "email", Value: user.Email, },
	}
	_, err = models.FindOne(models.UserCollection, filter, &result)

	if err != nil {
		re := models.ResponseError{
			Code:    constants.ErrCodeLoginFailure,
			Message: constants.MsgLoginFailure,
			OriginalError: err,
		}
		res.Error = re
		_ = json.NewEncoder(w).Encode(res)
		return
	}

	err = bcrypt.CompareHashAndPassword([]byte(result.Password), []byte(user.Password))

	if err != nil {
		re := models.ResponseError{
			Code:    constants.ErrCodeLoginFailure,
			Message: constants.MsgLoginFailure,
			OriginalError: err,
		}
		res.Error = re
		_ = json.NewEncoder(w).Encode(res)
		return
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"id": result.Id,
		"email":  result.Email,
		"firstName": result.FirstName,
		"lastName":  result.LastName,
		"date":	time.Now().Nanosecond(),
	})
	tokenString, err := token.SignedString([]byte(models.TokenSecret))

	if err != nil {
		re := models.ResponseError{
			Code:    constants.ErrCodeGeneratingToken,
			Message: constants.MsgErrorGenerateToken,
			OriginalError: err,
		}
		res.Error = re
		_ = json.NewEncoder(w).Encode(res)
		return
	}

	result.Token = tokenString
	result.Password = ""

	_ = json.NewEncoder(w).Encode(result)

	return

}
