package vManModels

import (
	"log"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

// SingleDataReponseModel - Response model for single stat
type SingleDataReponseModel struct {
	Error        interface{} `json:"error"`
	ErrorMessage interface{} `json:"message"`
	I18n         string      `json:"i18n"`
	Stat         interface{} `json:"stat"`
}

// ChartType - single stat chart
type ChartType int

const (
	// SingleStat - single stat chart
	SingleStat ChartType = 0
	// Bar - Bar chart
	Bar ChartType = 1
	// Pie - Pie chart
	Pie ChartType = 2
	// Donut - Donut chart
	Donut ChartType = 3
)

func (cdr ChartType) String() string {
	return [...]string{"singleStat", "barChart", "pieChart", "donutChart"}[cdr]
}

//
//
//
//
//
//
//
//

// RelatedToType - Related to types
type RelatedToType int

const (
	// BackupServers - related to backupServers
	BackupServers RelatedToType = 0
)

func (rtt RelatedToType) String() string {
	return [...]string{"BackupServers"}[rtt]
}

//
//
//
//
//
//
//
//

// WantType - Want types
type WantType int

const (
	// JobsCount - Get Jobs Count
	JobsCount WantType = 0

	// RepoCount - Get Repositories Count
	RepoCount WantType = 1
)

func (wt WantType) String() string {
	return [...]string{"jobCount", "repoCount"}[wt]
}

//
//
//

//
//
//
//
//
// ChartDataRequest - Request struct for chart data
type ChartDataRequest struct {
	Type         string               `json:"type"`
	RelatedTo    RelatedToDataRequest `json:"relatedTo"`
	Where        WhereDataRequest     `json:"where"`
	Want         WantDataRequest      `json:"want"`
	CSSClasses   interface{}          `json:"cssClasses"`
	ChartPayload interface{}          `json:"chartPayload"`
}

// RelatedToDataRequest - RelatedTo Struct
type RelatedToDataRequest struct {
	Type  string `json:"type"`
	Where string `json:"where"`
	I18n  string `json:"i18n"`
}

// WhereDataRequest - Where Struct
type WhereDataRequest struct {
	Type string `json:"type"`
	UID  string `json:"uid"`
	Name string `json:"name"`
	I18n string `json:"i18n"`
}

// WantDataRequest - Want Struct
type WantDataRequest struct {
	Type string `json:"Type"`
	I18n string `json:"i18n"`
}

// Get - Get Chart Info
func (c *ChartDataRequest) Get() interface{} {
	switch c.Type {
	case SingleStat.String():
		dbCol, theModel := c.getDbCollectionAndModel()
		if theModel != nil {
			filter := c.getFilterByUID()
			_, err := FindOne(dbCol, filter, &theModel)
			if err != nil {
				log.Println("Find one error:", err)
				return nil
			}
			return c.getWantedData(theModel)
		}
		return nil
	}
	return nil
}

// getDbCollectionAndModel - find db collection & model related to the uesers request
func (c *ChartDataRequest) getDbCollectionAndModel() (string, interface{}) {
	switch c.RelatedTo.Type {
	case BackupServers.String():
		var bs BackupServer
		return BkUpServerCollection, bs
	}
	return "", nil
}

// getFilterByUID - get filter bson.D based on UID
func (c *ChartDataRequest) getFilterByUID() primitive.D {
	filter := bson.D{
		{Key: "uId", Value: c.Where.UID},
	}

	return filter
}

// getWantedData - extract wanted data
func (c *ChartDataRequest) getWantedData(theModel interface{}) interface{} {
	switch c.Want.Type {

	case JobsCount.String():
		return c.fetchJobCount(theModel)
	case RepoCount.String():
		return c.fetchRepoCount(theModel)
	}

	return SingleDataReponseModel{
		Error: true,
	}
}

//
//
//
//
//
//
// FETCH THINGS :-D (Well documented :)) )
//
//
//
//
//
//

// fetchJobCount - Fetch Single Stat JobsCount
func (c *ChartDataRequest) fetchJobCount(theModel interface{}) interface{} {
	mrs, err := bson.Marshal(theModel)
	if err != nil {
		return SingleDataReponseModel{
			Error:        true,
			ErrorMessage: err.Error(),
		}
	}
	var bs BackupServer
	err = bson.Unmarshal(mrs, &bs)
	if err != nil {
		return SingleDataReponseModel{
			Error:        true,
			ErrorMessage: err.Error(),
		}
	}
	return SingleDataReponseModel{
		Error: false,
		I18n:  c.Want.I18n,
		Stat:  len(bs.Jobs),
	}
}

// fetchRepoCount - Fetch Single Stat RepositoriesCount
func (c *ChartDataRequest) fetchRepoCount(theModel interface{}) interface{} {
	mrs, err := bson.Marshal(theModel)
	if err != nil {
		return SingleDataReponseModel{
			Error:        true,
			ErrorMessage: err.Error(),
		}
	}
	var bs BackupServer
	err = bson.Unmarshal(mrs, &bs)
	if err != nil {
		return SingleDataReponseModel{
			Error:        true,
			ErrorMessage: err.Error(),
		}
	}
	return SingleDataReponseModel{
		Error: false,
		I18n:  c.Want.I18n,
		Stat:  len(bs.Repos),
	}
}
