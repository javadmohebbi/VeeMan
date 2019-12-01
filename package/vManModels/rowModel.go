package vManModels

import (
	"log"
	"strings"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

const RowCollection string = "Rows"

type Row struct {
	Id        interface{} `json:"Id" bson:"_id"`
	Enabled   bool        `json:"Enabled" bson:"enabled"`
	Widget    []Widget    `json:"Widgets" bson:"widgets"`
	UpdatedAt time.Time   `json:"UpdatedAt" bson:"updateAt"`
	CreatedAt time.Time   `json:"CreatedAt" bson:"createdAt"`
}

func (r *Row) GetNewEmpty() Row {
	return Row{}
}

type RowsForUI struct {
	BackupServers []BackupServer `json:"BackupServers"`
}

func (rc *RowsForUI) PrepareRowsForUI() {
	rc.BackupServers = getBackupServers()
}

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
		err = bson.Unmarshal(mr, &bs)
		if err != nil {
			continue
		}
		bs.Id = bs.Id.(primitive.ObjectID).String()
		bs.Id = strings.TrimLeft(strings.TrimRight(bs.Id.(string), "\")"), "ObjectID(\"")
		backupServers = append(backupServers, bs)
	}

	return backupServers
}
