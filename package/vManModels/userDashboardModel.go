package vManModels

import "time"

type UsersDashboards struct {
	Id					interface{}  		`json:"id" bson:"_id"`
	Name				string		`json:"Name" bson:"name"`
	Desc				string		`json:"Description" bson:"desc"`
	UpdatedAt			time.Time	`json:"UpdatedAt" bson:"updateAt"`
	CreatedAt			time.Time	`json:"CreatedAt" bson:"createdAt"`
}


