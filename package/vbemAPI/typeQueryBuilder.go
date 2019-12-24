package vbemAPI

// QueryString - struct
type QueryString struct {
	QueryString string `json:"queryString"`
}

// QueryWrapper - struct
// type QueryWrapper struct {
// 	Type    string  `json:"type"`
// 	Queries []Query `json:"queries"`
// }
//
// // Query - struct
// type Query struct {
// 	// Params        []QueryParams `json:"params"`
// 	// Sort          QuerySort   `json:"sort"`
// 	// Page          QueryPage   `json:"page"`
// 	QueryID       string        `json:"queryId"`
// 	Filters       []QueryFilter `json:"filters"`
// 	GroupOperator string        `json:"groupOperator"`
// }
//
// // QueryParams - struct
// // type QueryParams struct {
// // 	Key   string `json:"key"`
// // 	Value string `json:"value"`
// // }
//
// // QuerySort - struct
// // type QuerySort struct {
// // 	IsSort    bool   `json:"isSort"`
// // 	SortType  string `json:"sortType"`
// // 	SortField string `json:"sortField"`
// // }
//
// // QueryPage - struct
// // type QueryPage struct {
// // 	Page     int `json:"page"`
// // 	PageSize int `json:"pageSize"`
// // }
//
// // QueryFilter - struct
// type QueryFilter struct {
// 	Field              string `json:"field"`
// 	Value              string `json:"value"`
// 	LogicalOperator    string `json:"logicalOperator"`
// 	ComparisonOperator string `json:"comparisonOperator"`
// }
//
// // Build - build query
// func (qwr *QueryWrapper) Build() string {
// 	// return "?type=job&filter=(jobtype==replica;scheduleconfigured==false),(jobtype==backup;scheduleconfigured==true)"
// 	return "?type=" + qwr.Type
// }
