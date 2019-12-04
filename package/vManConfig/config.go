package vManConfig

import (
	"log"
	"os"
	"runtime"

	"github.com/spf13/viper"
)

// Configurations struct
type Configurations struct {
	Server   ServerConfigurations
	MongoDB  MongoDBConfigurations
	VbEntMgr VeeamEntMgrConfigurations
}

// ServerConfigurations struct
type ServerConfigurations struct {
	Address    string
	Port       int
	StaticPath string
}

// MongoDBConfigurations struct
type MongoDBConfigurations struct {
	Host     string
	Port     int
	Username string
	Password string
	Database string
}

// VeeamEntMgrConfigurations struct
type VeeamEntMgrConfigurations struct {
	Protocol    string
	Host        string
	Port        int
	Username    string
	Password    string
	Timeout     int64
	SessionPath string
}

var (
	configDevPath      string = "/home/mj/go/src/VeeamManager/config/"
	configDevName      string = "vman"
	configDevExtension string = "yaml"
)

const DummyIsDev bool = true

// ReadConfig - ReadConfig & Return Configurations struct
func ReadConfig() (Configurations, error) {

	configDevPath = PrepareConfigPath()

	// Set the file name of the configurations file
	viper.SetConfigName(configDevName)
	// Set the path to look for the configurations file
	viper.AddConfigPath(configDevPath)
	// Enable VIPER to read Environment Variables
	viper.AutomaticEnv()
	viper.SetConfigType(configDevExtension)
	var conf Configurations

	if err := viper.ReadInConfig(); err != nil {
		log.Printf("Error reading config file, %s", err)
		panic(err)
		// return conf, err
	}
	err := viper.Unmarshal(&conf)
	if err != nil {
		log.Printf("Unable to decode into struct, %v", err)
		return conf, err
	}

	return conf, err
}

// PrepareConfigPath - Config Dir
func PrepareConfigPath() string {
	if DummyIsDev {
		return configDevPath
	}
	if runtime.GOOS == "windows" {
		return os.Getenv("ProgramFiles") + "\\vMan\\"
	} else if runtime.GOOS == "darwin" || runtime.GOOS == "linux" {
		return "/etc/vman/"
	}
	log.Fatal("Read configs from: ", configDevPath)
	return configDevPath
}
