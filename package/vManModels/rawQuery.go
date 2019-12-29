package vManModels

import (
	"VeeamManager/package/vManConstants"
	"VeeamManager/package/vManValidators"
	"strings"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

const RawQueryCollection string = "RawQueries"

// RawQuery - struct
type RawQuery struct {
	ID        interface{} `json:"id" bson:"_id"`
	UID       interface{} `json:"uid" bson:"uid"`
	Queries   []Query     `json:"queries" bson:"queries"`
	Metadata  MetaData    `json:"metadata" bson:"metadata"`
	LastSeen  time.Time   `json:"LastSeen" bson:"lastSeen"`
	CreatedAt time.Time   `json:"CreatedAt" bson:"createdAt"`
}

// Queries - struct
type Query struct {
	CountID int      `json:"countId" bson:"countId"`
	queryID string   `json:"queryId" bson:"queryId"`
	Filters []Filter `json:"filters" bson:"filters"`
}

// Filter - struct
type Filter struct {
	Field              string `json:"field" bson:"field"`
	Value              string `json:"value" bson:"value"`
	LogicalOperator    string `json:"logicalOperator" bson:"logicalOperator"`
	ComparisonOperator string `json:"comparisonOperator" bson:"comparisonOperator"`
}

// MetaData - strut
type MetaData struct {
	Title    string   `json:"title" bson:"title"`
	ShowCol  []bool   `json:"showCol" bson:"showCol"`
	WantType []string `json:"wantedType" bson:"wantedType"`
}

// GetNewEmpty - Get a new Get New Empty instance of Model FindAll method
func (r *RawQuery) GetNewEmpty() interface{} {
	return RawQuery{}
}

// IsUnique - check if model is unique
func (r *RawQuery) IsUnique() (vManValidators.ValidationResult, bool) {
	vs := vManValidators.ValidationResult{
		Errors: nil,
		Count:  0,
	}
	var ve vManValidators.ValidationError

	if !vManValidators.IsUnique(RawQueryCollection, "uid", r.UID) {
		ve.Field = vManConstants.FldRawQuery
		ve.Code = vManConstants.ErrCodeUnique
		ve.Message = strings.Replace(vManConstants.MsgMustBeUnique, "%FIELD%", vManConstants.FldRawQuery, -1)
		vs.Count = vs.Count + 1
		vs.Errors = append(vs.Errors, ve)
	}
	var ch = true
	if vs.Count > 0 {
		ch = false
	}

	return vs, ch
}

// StoreOrUpdate - store new or update oldone
func (r *RawQuery) StoreOrUpdate() (RawQuery, error) {
	if _, isUnique := r.IsUnique(); isUnique {
		r.ID = primitive.NewObjectID()
		r.CreatedAt = time.Now()
		r.LastSeen = time.Now()
		_, err := InsertOne(RawQueryCollection, r)
		if err != nil {
			return RawQuery{}, err
		}
	} else {
		r.LastSeen = time.Now()
		filter := bson.M{
			"uid": bson.M{
				"$eq": r.UID,
			},
		}

		update := bson.M{
			"$set": bson.M{
				"lastSeen": time.Now(),
				"queries":  r.Queries,
				"metadata": r.Metadata,
			},
		}

		_, err := UpdateOne(RawQueryCollection, filter, update)

		if err != nil {
			return RawQuery{}, err
		}

	}

	rq := RawQuery{
		ID:        r.ID,
		UID:       r.UID,
		Queries:   r.Queries,
		Metadata:  r.Metadata,
		LastSeen:  r.LastSeen,
		CreatedAt: r.CreatedAt,
	}

	return rq, nil
}
