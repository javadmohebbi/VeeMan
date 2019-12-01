package vManModels

import "time"

const RowCollection string = "Rows"


type Row struct {
	Name				string		`json:"Name" bson:"name"`
	Desc				string		`json:"Description" bson:"desc"`
	Kind				string		`json:"Type" bson:"kind"`
	Widget				[]Widget	`json:"Widgets" bson:"widgets"`
	UpdatedAt			time.Time	`json:"UpdatedAt" bson:"updateAt"`
	CreatedAt			time.Time	`json:"CreatedAt" bson:"createdAt"`
}

