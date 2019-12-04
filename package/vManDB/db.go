package vManDB

import (
	"VeeamManager/package/vManConfig"
	"context"
	"fmt"
	"log"
	"time"

	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

func getMongoURI() (string, string) {
	conf, err := vManConfig.ReadConfig()
	if err != nil {
		log.Fatal("read config error: ", err)
	}

	if conf.MongoDB.Username != "" && conf.MongoDB.Password != "" {
		return fmt.Sprintf("mongodb://%v:%v@%s:%v", conf.MongoDB.Username, conf.MongoDB.Password, conf.MongoDB.Host, conf.MongoDB.Port), conf.MongoDB.Database
	}

	return fmt.Sprintf("mongodb://%s:%v", conf.MongoDB.Host, conf.MongoDB.Port), conf.MongoDB.Database
}

func GetDBCollection(collection string) (*mongo.Collection, *mongo.Client, error) {

	uri, dbName := getMongoURI()
	//log.Println(uri, dbName)

	ctx, _ := context.WithTimeout(context.Background(), 10*time.Second)
	client, err := mongo.Connect(ctx, options.Client().ApplyURI(uri))

	if err != nil {
		return nil, nil, err
	}

	err = client.Ping(context.Background(), nil)
	if err != nil {
		return nil, nil, err
	}

	retCollection := client.Database(dbName).Collection(collection)

	return retCollection, client, nil
}

// CloseDBConnection
func CloseDBConnection(client *mongo.Client) {
	err := client.Disconnect(context.TODO())

	if err != nil {
		log.Fatal(err)
	}
	// log.Println("Connection to MongoDB closed.")
}
