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
	Jobs          []Job          `json:"Jobs"`
	Repositories  []Repository   `json:"Repositories"`
}

// PrepareRowsForUI - prepare row information for UI (FrontEnd)
func (rc *RowsForUI) PrepareRowsForUI() {
	rc.BackupServers = getBackupServers()
	rc.Jobs = getJobs()
	rc.Repositories = getRepos()
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

// getJobs - Get List of Jobs
func getJobs() []Job {
	res, err := FindAll(JobsCollection, bson.D{})

	if err != nil {
		log.Println("Error getting All", err)
		return []Job{}
	}

	var jobs []Job
	for _, v := range res {
		var j Job
		mr, err := bson.Marshal(v)
		if err != nil {
			continue
		}
		err = bson.Unmarshal(mr, &j)
		if err != nil {
			continue
		}
		j.ID = j.ID.(primitive.ObjectID).String()
		j.ID = strings.TrimLeft(strings.TrimRight(j.ID.(string), "\")"), "ObjectID(\"")
		jobs = append(jobs, j)
	}

	return jobs
}

// getReps - Get List of Repositories
func getRepos() []Repository {
	res, err := FindAll(RepositoriesCollection, bson.D{})

	if err != nil {
		log.Println("Error getting All", err)
		return []Repository{}
	}

	var repos []Repository
	for _, v := range res {
		var r Repository
		mr, err := bson.Marshal(v)
		if err != nil {
			continue
		}
		err = bson.Unmarshal(mr, &r)
		if err != nil {
			continue
		}
		r.ID = r.ID.(primitive.ObjectID).String()
		r.ID = strings.TrimLeft(strings.TrimRight(r.ID.(string), "\")"), "ObjectID(\"")
		repos = append(repos, r)
	}

	return repos
}
