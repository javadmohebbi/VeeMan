package main

import (
	"VeeamManager/package/vManConfig"
	"VeeamManager/package/vManWebServer"
	"flag"
	"log"
)

func main() {
	argAddr := flag.String("addr", "", "Web listen address")
	argPort := flag.Int("port", 0, "Web listen port")

	flag.Parse()

	var addr = "0.0.0.0"
	var port = 80

	conf, err := vManConfig.ReadConfig()
	if err != nil {
		log.Fatal("Can not read config", err)
	}

	if *argAddr != "" {
		addr = *argAddr
	} else {
		addr = conf.Server.Address
	}

	if *argPort != 0 {
		port = *argPort
	} else {
		port = conf.Server.Port
	}

	w := vManWebServer.New(addr, port)
	w.Serve()

}
