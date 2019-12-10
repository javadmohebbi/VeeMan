package vManJobsController

// GetJobStatistics - Get jobs statistics
// func GetJobStatistics(w http.ResponseWriter, r *http.Request) {
// 	w.Header().Set("content-type", "application/json")
//
// 	var rr models.ResponseResult
// 	var user models.User
// 	log.Println(ctx.Get(r, "jwtToken"))
// 	if ok := user.GetLoggedIn(ctx.Get(r, "jwtToken")); ok {
// 		ls := ctx.Get(r, vbemAPI.VbEntMgrContextKey).(vbemAPI.LogonSession)
//
// 		refs, err := vbemCalls.GetJobStatistics(ls.SessionId)
// 		if err != nil {
// 			res := models.ResponseResult{
// 				Error:  true,
// 				Result: err.Error(),
// 			}
// 			_ = json.NewEncoder(w).Encode(res)
// 			return
// 		}
//
// 		_ = json.NewEncoder(w).Encode(refs)
// 		return
// 	}
//
// 	rr = models.ResponseResult{
// 		Error:  "Token is invalid!",
// 		Result: "",
// 	}
// 	_ = json.NewEncoder(w).Encode(rr)
// 	return
//
// }
