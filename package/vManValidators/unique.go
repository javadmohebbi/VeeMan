package vManValidators

import (
	"VeeamManager/package/vManDB"
	"context"

	"go.mongodb.org/mongo-driver/bson"
)

// IsUnique - validate for unique
func IsUnique(collectionName string, field string, value interface{}) bool {
	collection, client, err := vManDB.GetDBCollection(collectionName)

	defer vManDB.CloseDBConnection(client)

	if err != nil {
		return false
	}

	//sr := collection.FindOne(context.Background(), bson.D{{field, value}}).Decode(&result)
	sr := collection.FindOne(context.Background(), bson.D{{Key: field, Value: value}})

	if sr.Err() == nil {
		return false
	}
	if sr.Err().Error() != "mongo: no documents in result" {
		return false
	}

	return true
}
