package vManMiddlewares

import (
	constants "VeeamManager/package/vManConstants"
	models "VeeamManager/package/vManModels"
	"encoding/json"
	"fmt"
	"github.com/dgrijalva/jwt-go"
	"github.com/gorilla/context"
	"net/http"
	"strings"
)

// Validate Token String
func ValidateTokenMiddleware(next http.HandlerFunc) http.HandlerFunc {
	return http.HandlerFunc(func(w http.ResponseWriter, req *http.Request) {
		w.Header().Set("content-type", "application/json")

		authorizationHeader := req.Header.Get("authorization")
		if authorizationHeader != "" {
			//bearerToken := strings.Split(authorizationHeader, " ")
			//if len(bearerToken) == 2 {
			token, err := jwt.Parse(authorizationHeader, func(token *jwt.Token) (interface{}, error) {
				if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
					return nil, fmt.Errorf(strings.ToLower(constants.MsgTokenValidationError))
				}
				return []byte(models.TokenSecret), nil
			})
			if err != nil {
				//res := models.ResponseResult{
				//	Error:  err.Error(),
				//	Result: "Token Validation Error",
				//}
				//_ = json.NewEncoder(w).Encode(res)
				re := models.ResponseError{
					Code:    constants.ErrCodeInvalidToken,
					Message: constants.MsgInvalidToken,
					OriginalError: nil,
				}
				res := models.ResponseResult{
					Error:  re,
					Result: nil,
				}
				_ = json.NewEncoder(w).Encode(res)
				return
			}
			if token.Valid {
				context.Set(req, "jwtToken", token.Claims)
				next(w, req)
			} else {
				re := models.ResponseError{
					Code:    constants.ErrCodeInvalidToken,
					Message: constants.MsgInvalidToken,
					OriginalError: nil,
				}
				res := models.ResponseResult{
					Error:  re,
					Result: nil,
				}
				_ = json.NewEncoder(w).Encode(res)
			}
			//}
		} else {
			re := models.ResponseError{
				Code:    constants.ErrCodeAuthorizationHeaderRequired,
				Message: constants.MsgAuthorizationHeaderRequired,
				OriginalError: nil,
			}
			res := models.ResponseResult{
				Error:  re,
				Result: nil,
			}
			_ = json.NewEncoder(w).Encode(res)
		}
	})
}


// Validate Token String
func ValidateTokenMiddlewareUse(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, req *http.Request) {
		w.Header().Set("content-type", "application/json")

		authorizationHeader := req.Header.Get("authorization")
		if authorizationHeader != "" {
			//bearerToken := strings.Split(authorizationHeader, " ")
			//if len(bearerToken) == 2 {
			token, err := jwt.Parse(authorizationHeader, func(token *jwt.Token) (interface{}, error) {
				if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
					return nil, fmt.Errorf(strings.ToLower(constants.MsgTokenValidationError))
				}
				return []byte(models.TokenSecret), nil
			})
			if err != nil {
				//res := models.ResponseResult{
				//	Error:  err.Error(),
				//	Result: "Token Validation Error",
				//}
				//_ = json.NewEncoder(w).Encode(res)
				re := models.ResponseError{
					Code:    constants.ErrCodeInvalidToken,
					Message: constants.MsgInvalidToken,
					OriginalError: nil,
				}
				res := models.ResponseResult{
					Error:  re,
					Result: nil,
				}
				_ = json.NewEncoder(w).Encode(res)
				return
			}
			if token.Valid {
				context.Set(req, "jwtToken", token.Claims)
				next.ServeHTTP(w, req)
			} else {
				re := models.ResponseError{
					Code:    constants.ErrCodeInvalidToken,
					Message: constants.MsgInvalidToken,
					OriginalError: nil,
				}
				res := models.ResponseResult{
					Error:  re,
					Result: nil,
				}
				_ = json.NewEncoder(w).Encode(res)
			}
			//}
		} else {
			re := models.ResponseError{
				Code:    constants.ErrCodeAuthorizationHeaderRequired,
				Message: constants.MsgAuthorizationHeaderRequired,
				OriginalError: nil,
			}
			res := models.ResponseResult{
				Error:  re,
				Result: nil,
			}
			_ = json.NewEncoder(w).Encode(res)
		}
	})
}



// Validate Token String
func ValidateTokenForWebSocketMiddleware(next http.HandlerFunc) http.HandlerFunc {
	return http.HandlerFunc(func(w http.ResponseWriter, req *http.Request) {
		authorizationHeader := req.Header.Get("Sec-WebSocket-Protocol")
		if authorizationHeader != "" {
			//bearerToken := strings.Split(authorizationHeader, " ")
			//if len(bearerToken) == 2 {
			//log.Println(strings.Split(authorizationHeader, ", ")[1])
			respHeader := authorizationHeader

			authorizationHeader = strings.Split(authorizationHeader, ", ")[1]
			token, err := jwt.Parse(authorizationHeader, func(token *jwt.Token) (interface{}, error) {
				if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
					return nil, fmt.Errorf("token validation error")
				}
				return []byte(models.TokenSecret), nil
			})
			if err != nil {
				res := models.ResponseResult{
					Error:  err.Error(),
					Result: "Token Validation Error",
				}
				_ = json.NewEncoder(w).Encode(res)
				return
			}
			if token.Valid {
				context.Set(req, "jwtToken", token.Claims)
				w.Header().Set("Sec-WebSocket-Protocol", respHeader)
				next(w, req)
			} else {
				res := models.ResponseResult{
					Error:  "Invalid authorization token",
					Result: "-",
				}
				_ = json.NewEncoder(w).Encode(res)
			}
			//}
		} else {
			res := models.ResponseResult{
				Error:  "An authorization header is required",
				Result: "-",
			}
			_ = json.NewEncoder(w).Encode(res)
		}
	})
}