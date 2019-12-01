package vManModels

import (
	"VeeamManager/package/vManConstants"
	"VeeamManager/package/vManValidators"
	"VeeamManager/package/vbemAPI"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"strings"
	"time"
)

const BkUpServerCollection string = "BackupServers"

type BackupServer struct {
	Name				string		`json:"Name" bson:"name"`
	Type				string		`json:"Type" bson:"type"`
	UID					string		`json:"UID" bson:"uId"`
	Href				string		`json:"Href" bson:"href"`
	LastSeen			time.Time	`json:"LastSeen" bson:"lastSeen"`
	CreatedAt			time.Time	`json:"CreatedAt" bson:"createdAt"`
}



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

	var ch bool = true
	if vs.Count > 0 { ch = false }

	return vs, ch
}

func (bs *BackupServer) UpdateLastSeen () (*mongo.UpdateResult, bool) {
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
	} else {
		return result, true
	}

}

func StoreOrUpdateBackupServers(refs []vbemAPI.BackupServers) {
	for _, bkup := range refs {
		bs := BackupServer{
			Name: bkup.Name,
			Type: bkup.Type,
			UID:  bkup.UID,
			Href: bkup.Href,
		}
		if _, validationResult := bs.Valid(); validationResult {
			bs.CreatedAt = time.Now()
			bs.LastSeen = time.Now()
			_, _ = InsertOne(BkUpServerCollection, bs)
		} else {
			_, _ = bs.UpdateLastSeen()
		}
	}
}