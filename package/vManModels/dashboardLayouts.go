package vManModels

import (
	"time"

	"go.mongodb.org/mongo-driver/bson"
)

// DashboardLayoutCollection - Mongo DB collection name
const DashboardLayoutCollection string = "DashboardLayouts"

// DashboardLayout - RowLayout Model
type DashboardLayout struct {
	DashboardID interface{} `json:"DashboardId" bson:"dashboardId"`
	Layouts     interface{} `json:"layouts" bson:"layouts"`
	UpdatedAt   time.Time   `json:"UpdatedAt" bson:"updateAt"`
	CreatedAt   time.Time   `json:"CreatedAt" bson:"createdAt"`
}

// GetNewEmpty - Get a new empty object from this model
func (rl *DashboardLayout) GetNewEmpty() interface{} {
	return DashboardLayout{}

}

// IsDashboardIDExist - Check if dashboard is exist
func (rl *DashboardLayout) IsDashboardIDExist() bool {

	e := bson.D{
		{Key: "_id", Value: GetObjectId(rl.DashboardID.(string))},
	}

	var dashboard Dashboard
	_, err := FindOne(DashboardCollection, e, &dashboard)

	if err != nil {
		return false
	}

	if dashboard.Id != nil {
		return true
	}

	return false
}

// IsDashboardLayoutExist - Check if dashboard layout is exist
func (rl *DashboardLayout) IsDashboardLayoutExist() bool {
	e := bson.D{
		{Key: "dashboardId", Value: rl.DashboardID},
	}

	var dashboardLayout DashboardLayout
	_, err := FindOne(DashboardLayoutCollection, e, &dashboardLayout)

	if err != nil {
		return false
	}

	if dashboardLayout.DashboardID != nil {
		return true
	}

	return false

}
