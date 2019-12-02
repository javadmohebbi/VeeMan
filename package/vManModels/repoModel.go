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

// RepositoriesCollection - Mongo DB collection name
const RepositoriesCollection string = "Repositories"

// Repository - Repository Model
type Repository struct {
	ID        interface{} `json:"Id" bson:"_id"`
	Name      string      `json:"Name" bson:"name"`
	Type      string      `json:"Type" bson:"type"`
	UID       string      `json:"UID" bson:"uId"`
	Href      string      `json:"Href" bson:"href"`
	LastSeen  time.Time   `json:"LastSeen" bson:"lastSeen"`
	CreatedAt time.Time   `json:"CreatedAt" bson:"createdAt"`
}

// GetNewEmpty - Get a new Get New Empty instance of Model FindAll method
func (r *Repository) GetNewEmpty() interface{} {
	return Repository{}
}

// Valid - Validate Model
func (r *Repository) Valid() (vManValidators.ValidationResult, bool) {
	vs := vManValidators.ValidationResult{
		Errors: nil,
		Count:  0,
	}

	var ve vManValidators.ValidationError

	if !vManValidators.IsUnique(RepositoriesCollection, "uId", r.UID) {
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

// UpdateRepositoryLastSeen - Update Last Seen
func (r *Repository) UpdateRepositoryLastSeen() (*mongo.UpdateResult, bool) {
	filter := bson.M{
		"uId": bson.M{
			"$eq": r.UID,
		},
	}

	update := bson.M{
		"$set": bson.M{
			"lastSeen": time.Now(),
		},
	}

	result, err := UpdateOne(RepositoriesCollection, filter, update)

	if err != nil {
		return nil, false
	}

	return result, true

}

// StoreOrUpdateRepository - Store if not exist and update LastSeen if it's exist
func StoreOrUpdateRepository(refs []vbemAPI.Repositories) {
	for _, r := range refs {
		repo := Repository{
			Name: r.Name,
			Type: r.Type,
			UID:  r.UID,
			Href: r.Href,
		}
		repo.ID = primitive.NewObjectID()
		if _, validationResult := repo.Valid(); validationResult {
			repo.CreatedAt = time.Now()
			repo.LastSeen = time.Now()
			_, _ = InsertOne(RepositoriesCollection, repo)
		} else {
			_, _ = repo.UpdateRepositoryLastSeen()
		}
	}
}

// ShouldStoreOrShouldUpdateRepository - return true of store needed or false if update needed
func ShouldStoreOrShouldUpdateRepository(repo Repository) (bool, Repository) {
	repo.ID = primitive.NewObjectID()
	if _, validationResult := repo.Valid(); validationResult {
		repo.CreatedAt = time.Now()
		repo.LastSeen = time.Now()
		// _, _ = InsertOne(RepositoriesCollection, job)
		return true, repo
	}

	return false, repo
}
