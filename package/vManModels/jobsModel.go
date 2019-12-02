package vManModels

import (
	"VeeamManager/package/vManConstants"
	"VeeamManager/package/vManValidators"
	"VeeamManager/package/vbemAPI"
	"strings"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

// JobsCollection - Mongo DB collection name
const JobsCollection string = "Jobs"

// Job - Jobs Model
type Job struct {
	ID        interface{} `json:"Id" bson:"_id"`
	Name      string      `json:"Name" bson:"name"`
	Type      string      `json:"Type" bson:"type"`
	UID       string      `json:"UID" bson:"uId"`
	Href      string      `json:"Href" bson:"href"`
	LastSeen  time.Time   `json:"LastSeen" bson:"lastSeen"`
	CreatedAt time.Time   `json:"CreatedAt" bson:"createdAt"`
}

// GetNewEmpty - Get a new Get New Empty instance of Model FindAll method
func (j *Job) GetNewEmpty() interface{} {
	return Job{}
}

// Valid - Validate Model
func (j *Job) Valid() (vManValidators.ValidationResult, bool) {
	vs := vManValidators.ValidationResult{
		Errors: nil,
		Count:  0,
	}

	var ve vManValidators.ValidationError

	if !vManValidators.IsUnique(JobsCollection, "uId", j.UID) {
		ve.Field = vManConstants.FldBackupServer
		ve.Code = vManConstants.ErrCodeUnique
		ve.Message = strings.Replace(vManConstants.MsgMustBeUnique, "%FIELD%", vManConstants.FldBackupServer, -1)
		vs.Count = vs.Count + 1
		vs.Errors = append(vs.Errors, ve)
	}

	var ch = true
	if vs.Count > 0 {
		ch = false
	}

	return vs, ch
}

// UpdateJobLastSeen - Update Last Seen
func (j *Job) UpdateJobLastSeen() (*mongo.UpdateResult, bool) {
	filter := bson.M{
		"uId": bson.M{
			"$eq": j.UID,
		},
	}

	update := bson.M{
		"$set": bson.M{
			"lastSeen": time.Now(),
		},
	}

	result, err := UpdateOne(JobsCollection, filter, update)

	if err != nil {
		return nil, false
	}

	return result, true

}

// StoreOrUpdateJobs - Store if not exist and update LastSeen if it's exist
func StoreOrUpdateJobs(refs []vbemAPI.Jobs) {
	for _, j := range refs {
		job := Job{
			Name: j.Name,
			Type: j.Type,
			UID:  j.UID,
			Href: j.Href,
		}
		job.ID = primitive.NewObjectID()
		if _, validationResult := job.Valid(); validationResult {
			job.CreatedAt = time.Now()
			job.LastSeen = time.Now()
			_, _ = InsertOne(JobsCollection, job)
		} else {
			_, _ = job.UpdateJobLastSeen()
		}
	}
}

// ShouldStoreOrShouldUpdateJob - return true of store needed or false if update needed
func ShouldStoreOrShouldUpdateJob(job Job) (bool, Job) {
	job.ID = primitive.NewObjectID()
	if _, validationResult := job.Valid(); validationResult {
		job.CreatedAt = time.Now()
		job.LastSeen = time.Now()
		// _, _ = InsertOne(JobsCollection, job)
		return true, job
	}

	return false, job
}
