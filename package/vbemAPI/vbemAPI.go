package vbemAPI

import (
	"VeeamManager/package/vManConfig"
	"log"
	"strconv"
)

type BaseUriAndCred struct {
	BaseURI		string
	Username	string
	Password	string
	Timeout		int64
}

func GetBase() BaseUriAndCred{
	conf, err := vManConfig.ReadConfig()
	
	if err != nil {
		log.Fatal("Can not read config", err)
	}
	
	bc := BaseUriAndCred{
		BaseURI:  conf.VbEntMgr.Protocol + "://" + conf.VbEntMgr.Host + ":" + strconv.Itoa(conf.VbEntMgr.Port) + "/api",
		Username: conf.VbEntMgr.Username,
		Password: conf.VbEntMgr.Password,
		Timeout:  conf.VbEntMgr.Timeout,
	}
	
	return bc
}