package vManModels

import (
	"log"
	"strings"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

// RowCollection - Mongo DB collection name
const RowCollection string = "Rows"

// Row - Row Model
type Row struct {
	ID        interface{} `json:"Id" bson:"_id"`
	Enabled   bool        `json:"Enabled" bson:"enabled"`
	Widget    []Widget    `json:"Widgets" bson:"widgets"`
	UpdatedAt time.Time   `json:"UpdatedAt" bson:"updateAt"`
	CreatedAt time.Time   `json:"CreatedAt" bson:"createdAt"`
}

// GetNewEmpty - Get a new Get New Empty instance of Model FindAll method
func (r *Row) GetNewEmpty() Row {
	return Row{}
}

// RowsForUI - An struct for providing rows information for UI
type RowsForUI struct {
	BackupServers []BackupServer `json:"BackupServers"`
}

// PrepareRowsForUI - prepare row information for UI (FrontEnd)
func (rc *RowsForUI) PrepareRowsForUI() {
	rc.BackupServers = getBackupServers()
}

// getBackupServers - Get List of BackupServers
func getBackupServers() []BackupServer {
	res, err := FindAll(BkUpServerCollection, bson.D{})

	if err != nil {
		log.Println("Error getting All", err)
		return []BackupServer{}
	}

	var backupServers []BackupServer
	for _, v := range res {
		var bs BackupServer
		mr, err := bson.Marshal(v)
		if err != nil {
			continue
		}
		err = bson.Unmarshal(mr, &bs)
		if err != nil {
			continue
		}
		bs.ID = bs.ID.(primitive.ObjectID).String()
		bs.ID = strings.TrimLeft(strings.TrimRight(bs.ID.(string), "\")"), "ObjectID(\"")
		backupServers = append(backupServers, bs)
	}

	return backupServers
}
