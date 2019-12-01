package vManModels

import "time"

const WidgetCollection string = "Widgets"

type Widget struct {
	Name      string    `json:"Name" bson:"name"`
	Desc      string    `json:"Description" bson:"desc"`
	UpdatedAt time.Time `json:"UpdatedAt" bson:"updateAt"`
	CreatedAt time.Time `json:"CreatedAt" bson:"createdAt"`
}
