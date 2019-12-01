package vManModels

type ResponseResult struct {
	Error  		interface{} 		`json:"error"`
	Result 		interface{}			`json:"result"`
}
type ResponseError struct {
	Code			int					`json:"ErrorCode"`
	Message			string				`json:"ErrorMessage"`
	OriginalError	interface{}			`json:"OriginalError"`
}
