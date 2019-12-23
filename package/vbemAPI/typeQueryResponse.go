package vbemAPI

// QueryResponse - struct
type QueryResponse struct {
	QueryResult struct {
		PageInfo interface{}            `json:"PagingInfo"`
		Refs     map[string]interface{} `json:"Refs"`
	} `json:"QueryResult"`
}
