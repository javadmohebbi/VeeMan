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

// BkUpServerCollection - Mongo DB collection name
const BkUpServerCollection string = "BackupServers"

// BackupServer - BackupServer model
type BackupServer struct {
	ID        interface{}   `json:"Id" bson:"_id"`
	Name      string        `json:"Name" bson:"name"`
	Type      string        `json:"Type" bson:"type"`
	UID       string        `json:"UID" bson:"uId"`
	Href      string        `json:"Href" bson:"href"`
	Jobs      []interface{} `json:"Jobs" bson:"jobs"`
	Repos     []interface{} `json:"Repositories" bson:"repos"`
	LastSeen  time.Time     `json:"LastSeen" bson:"lastSeen"`
	CreatedAt time.Time     `json:"CreatedAt" bson:"createdAt"`
}

// GetNewEmpty - Get a new Get New Empty instance of Model FindAll method
func (bs *BackupServer) GetNewEmpty() interface{} {
	return BackupServer{}
}

// Valid - Validate Model
func (bs *BackupServer) Valid() (vManValidators.ValidationResult, bool) {
	vs := vManValidators.ValidationResult{
		Errors: nil,
		Count:  0,
	}

	var ve vManValidators.ValidationError

	if !vManValidators.IsUnique(BkUpServerCollection, "uId", bs.UID) {
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

// UpdateBackupServerLastSeen - Update Last Seen
func (bs *BackupServer) UpdateBackupServerLastSeen() (*mongo.UpdateResult, bool) {
	filter := bson.M{
		"uId": bson.M{
			"$eq": bs.UID,
		},
	}

	update := bson.M{
		"$set": bson.M{
			"lastSeen": time.Now(),
		},
	}

	result, err := UpdateOne(BkUpServerCollection, filter, update)

	if err != nil {
		return nil, false
	}

	return result, true

}

// UpdateBackupServerJobList - Update Jobs related to backupServer
func (bs *BackupServer) UpdateBackupServerJobList(jobIDs []interface{}) (*mongo.UpdateResult, bool) {
	filter := bson.M{
		"uId": bson.M{
			"$eq": bs.UID,
		},
	}

	update := bson.M{
		"$set": bson.M{
			"jobs": jobIDs,
		},
	}

	result, err := UpdateOne(BkUpServerCollection, filter, update)

	if err != nil {
		return nil, false
	}

	return result, true
}

// UpdateBackupServerRepoList - Update Repositories related to backupServer
func (bs *BackupServer) UpdateBackupServerRepoList(repoIDs []interface{}) (*mongo.UpdateResult, bool) {
	filter := bson.M{
		"uId": bson.M{
			"$eq": bs.UID,
		},
	}

	update := bson.M{
		"$set": bson.M{
			"repos": repoIDs,
		},
	}

	result, err := UpdateOne(BkUpServerCollection, filter, update)

	if err != nil {
		return nil, false
	}

	return result, true
}

// StoreOrUpdateBackupServers - Store if not exist and update LastSeen if it's exist
func StoreOrUpdateBackupServers(refs []vbemAPI.BackupServers) {

	for _, bkup := range refs {
		bs := BackupServer{
			Name: bkup.Name,
			Type: bkup.Type,
			UID:  bkup.UID,
			Href: bkup.Href,
		}

		jobObjectIds := extractJobsFromRefs(bkup.Jobs)
		repoObjectIds := extractReposFromRefs(bkup.Repos)

		bs.ID = primitive.NewObjectID()

		if _, validationResult := bs.Valid(); validationResult {

			bs.Jobs = jobObjectIds
			bs.Repos = repoObjectIds

			bs.CreatedAt = time.Now()
			bs.LastSeen = time.Now()
			_, _ = InsertOne(BkUpServerCollection, bs)
		} else {
			_, _ = bs.UpdateBackupServerJobList(jobObjectIds)
			_, _ = bs.UpdateBackupServerRepoList(repoObjectIds)

			_, _ = bs.UpdateBackupServerLastSeen()
		}
	}
}

// extractJobsFromRefs - Store or Update Jobs and return IDs for BackupServer Collection
func extractJobsFromRefs(refJobs []vbemAPI.Jobs) []interface{} {
	var jobObjectIds []interface{}
	for _, jb := range refJobs {
		job := Job{
			Name: jb.Name,
			Type: jb.Type,
			UID:  jb.UID,
			Href: jb.Href,
		}
		shouldInsert, job := ShouldStoreOrShouldUpdateJob(job)
		var ior *mongo.InsertOneResult
		var oID interface{}
		var jobRes Job

		if shouldInsert {
			ior, _ = InsertOne(JobsCollection, job)
		} else {
			_, _ = job.UpdateJobLastSeen()
			_, _ = FindOne(JobsCollection, bson.D{{Key: "uId", Value: jb.UID}}, &jobRes)
		}

		// var jobId interface{}
		if shouldInsert {
			if ior != nil {
				oID = ior.InsertedID
			}

		} else {
			if jobRes.ID != nil {
				oID = jobRes.ID
			}

		}
		if oID != nil {
			jobObjectIds = append(jobObjectIds, oID)
		}
	}
	return jobObjectIds
}

// extractReposFromRefs - Store or Update repositories and return IDs for BackupServer Collection
func extractReposFromRefs(refRepo []vbemAPI.Repositories) []interface{} {
	var repoObjectIds []interface{}
	for _, rp := range refRepo {
		repo := Repository{
			Name: rp.Name,
			Type: rp.Type,
			UID:  rp.UID,
			Href: rp.Href,
		}
		shouldInsert, repo := ShouldStoreOrShouldUpdateRepository(repo)
		var ior *mongo.InsertOneResult
		var oID interface{}
		var repRes Repository

		if shouldInsert {
			ior, _ = InsertOne(RepositoriesCollection, repo)
		} else {
			_, _ = repo.UpdateRepositoryLastSeen()
			_, _ = FindOne(RepositoriesCollection, bson.D{{Key: "uId", Value: rp.UID}}, &repRes)
		}

		// var jobId interface{}
		if shouldInsert {
			if ior != nil {
				oID = ior.InsertedID
			}

		} else {
			if repRes.ID != nil {
				oID = repRes.ID
			}

		}
		if oID != nil {
			repoObjectIds = append(repoObjectIds, oID)
		}
	}
	return repoObjectIds
}
