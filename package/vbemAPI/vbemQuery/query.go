package vbemQuery

import (
	"VeeamManager/package/vbemAPI"
	"bytes"
	"encoding/base64"
	xml2json "github.com/basgys/goxml2json"
	"io/ioutil"
	"log"
	"net/http"
	"strings"
	"time"
)

type Query struct {
	Path				string
	HttpMethod			string
	SessionId			string
	Type				string
}


func New(path string, method string, session string) *Query {
	return &Query{
		Path:       path,
		HttpMethod: method,
		SessionId: session,
		Type: "xml",
	}
}

func (q *Query) Run() (*bytes.Buffer, error){
	bc := vbemAPI.GetBase()

	if q.Type == "" { q.Type = "xml" }

	tm := time.Duration(time.Duration(bc.Timeout) * time.Second)

	client := http.Client{
		Timeout: tm,
	}

	req, err := http.NewRequest(q.HttpMethod, bc.BaseURI + q.Path, nil)

	if q.Type == "xml" {
		req.Header.Set("Content-Type", "application/xml")
	} else {
		req.Header.Set("Content-Type", "application/json")
	}

	if q.SessionId == "" {
		req.SetBasicAuth(bc.Username, bc.Password)
	} else {
		enc :=  base64.StdEncoding.EncodeToString([]byte(q.SessionId))
		req.Header.Set("X-RestSvcSessionId", enc)
	}


	if err != nil {
		log.Println("Can not create http request ", err)
		return nil, err
	}


	resp, err := client.Do(req)

	if err != nil {
		log.Println("Can not send http request ", err)
		return nil, err
	}

	defer resp.Body.Close()

	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		log.Println("Can read response body ", err)
		return nil, err
	}

	if q.Type == "json" {
		jsOrg := bytes.NewBuffer(body)

		return jsOrg, nil
	}



	jsonResp, err := xml2json.Convert(strings.NewReader(string(body)))
	if err != nil {
		log.Println("Can read convert XML to JSON ", err)
		return nil, err
	}



	strJson := strings.Replace(jsonResp.String(), "\"-", "\"", -1)


	return bytes.NewBuffer([]byte(strJson)), nil
}




