package vManModels

// ResponseResult - JSON Response struct
type ResponseResult struct {
	Error  interface{} `json:"error"`
	Result interface{} `json:"result"`
}

// ResponseError - JSON Response for errors
type ResponseError struct {
	Code          int         `json:"ErrorCode"`
	Message       string      `json:"ErrorMessage"`
	OriginalError interface{} `json:"OriginalError"`
}

//DashboardReponseResult - JSON result for a dashbaord
type DashboardReponseResult struct {
	Error   interface{} `json:"error"`
	Result  interface{} `json:"result"`
	Layouts interface{} `json:"layouts"`
}
