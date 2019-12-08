package vManModels

import (
	"time"

	"go.mongodb.org/mongo-driver/bson"
)

// WidgetCollection - Collection Name
const WidgetCollection string = "Widgets"

// Widget - Model
type Widget struct {
	Title     string           `json:"Title" bson:"title"`
	Desc      string           `json:"Description" bson:"desc"`
	ItemID    interface{}      `json:"ItemId" bson:"itemId"`
	ChartData ChartDataRequest `json:"ChartData" bson:"chartData"`
	UpdatedAt time.Time        `json:"UpdatedAt" bson:"updatedAt"`
	CreatedAt time.Time        `json:"CreatedAt" bson:"createdAt"`
}

// GetNewEmpty - Get a new empty object from this model
func (w *Widget) GetNewEmpty() interface{} {
	return Widget{}
}

// IsWidgetExist - Check if Widgets is exist
func (w *Widget) IsWidgetExist() bool {
	e := bson.D{
		{Key: "itemId", Value: w.ItemID},
	}

	var widget Widget
	_, err := FindOne(WidgetCollection, e, &widget)

	if err != nil {
		return false
	}

	if widget.ItemID != nil {
		return true
	}

	return false
}
