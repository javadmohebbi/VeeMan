package vManValidators

import (
	"VeeamManager/package/vManDB"
	"context"
	"go.mongodb.org/mongo-driver/bson"
)

func IsUnique(collectionName string, field string, value interface{}) bool {
	collection, err := vManDB.GetDBCollection(collectionName)

	if err != nil {
		return false
	}

	//sr := collection.FindOne(context.Background(), bson.D{{field, value}}).Decode(&result)
	sr := collection.FindOne(context.Background(), bson.D{{field, value}})
	
	if sr.Err() == nil {
		return false
	}
	if sr.Err().Error() != "mongo: no documents in result" {
		return false
	}

	return true
}
