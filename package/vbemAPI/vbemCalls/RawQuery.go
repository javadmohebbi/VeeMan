package vbemCalls

import (
	"VeeamManager/package/vbemAPI/vbemQuery"
	"bytes"
)

// HTTPRawQueryBasePath - Raw query base API path
const HTTPRawQueryBasePath = "/query?"

// RawQuery - Run raw query and get results
func RawQuery(sessionID string, query string) (*bytes.Buffer, error) {
	q := vbemQuery.New(HTTPRawQueryBasePath+query+"&format=entities", "GET", sessionID)
	jsonResp, err := q.Run()
	if err != nil {
		return nil, err
	}
	return jsonResp, nil
}
