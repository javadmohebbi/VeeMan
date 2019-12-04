package vManModels

import (
	db "VeeamManager/package/vManDB"
	"context"
	"log"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

// InsertOne - Insert one element to Database Collection
func InsertOne(collectionName string, model interface{}) (*mongo.InsertOneResult, error) {
	collection, client, err := db.GetDBCollection(collectionName)

	defer db.CloseDBConnection(client)

	if err != nil {
		return nil, err
	}

	ior, err := collection.InsertOne(context.TODO(), model)

	if err != nil {
		return nil, err
	}

	return ior, nil
}

///**
//FindOne - Query database for one result
//*/
//func FindOne(collectionName string, key string, value interface{}, result interface{}) (interface{}, error) {
//	collection, err := db.GetDBCollection(collectionName)
//
//	if err != nil {
//		return nil, err
//	}
//
//	err = collection.FindOne(context.TODO(), bson.D{{key, value}}).Decode(result)
//
//	if err != nil {
//		return nil, err
//	}
//
//	return result, nil
//}

// FindOne - Query database for one result
func FindOne(collectionName string, bsonFilter bson.D, result interface{}) (interface{}, error) {
	collection, client, err := db.GetDBCollection(collectionName)

	defer db.CloseDBConnection(client)

	if err != nil {
		return nil, err
	}

	err = collection.FindOne(context.TODO(), bsonFilter).Decode(result)

	if err != nil {
		return nil, err
	}

	return result, nil
}

// FindAll - Query database for All result
func FindAll(collectionName string, bsonFilter bson.D) ([]interface{}, error) {
	collection, client, err := db.GetDBCollection(collectionName)

	defer db.CloseDBConnection(client)

	if err != nil {
		return nil, err
	}

	cursor, err := collection.Find(context.TODO(), bsonFilter)

	if err != nil {
		return nil, err
	}

	defer cursor.Close(context.Background())

	var result []interface{}
	for cursor.Next(context.Background()) {
		var res interface{}
		// res := fn()

		err := cursor.Decode(&res)
		if err != nil {
			log.Println("decode error: ", err)
		} else {
			result = append(result, res)
		}
	}

	return result, nil
}

// UpdateOne - Update one row
func UpdateOne(collectionName string, filter interface{}, update interface{}) (*mongo.UpdateResult, error) {
	collection, client, err := db.GetDBCollection(collectionName)

	defer db.CloseDBConnection(client)

	if err != nil {
		return nil, err
	}

	return collection.UpdateOne(context.TODO(), filter, update)
}

// GetObjectId - Get Mongo DB Object Id From string
func GetObjectId(hexStrObjectId string) primitive.ObjectID {
	objectId, err := primitive.ObjectIDFromHex(hexStrObjectId)
	if err != nil {
		return primitive.ObjectID{}
	}
	return objectId
}
