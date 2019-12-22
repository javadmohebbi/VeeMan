package vbemCalls

import (
	"VeeamManager/package/vbemAPI"
	"VeeamManager/package/vbemAPI/vbemQuery"
	"bytes"
)

// HTTPRawQueryBasePath - Raw query base API path
const HTTPRawQueryBasePath = "/query"

// RawQuery - Run raw query and get results
func RawQuery(sessionID string, query vbemAPI.QueryWrapper) (*bytes.Buffer, error) {
	// path := strings.Replace(HTTPGetJobs, "%UID%", bkupServerID, -1)
	preparedQuery := query.Build()
	q := vbemQuery.New(HTTPRawQueryBasePath+preparedQuery, "GET", sessionID)
	jsonResp, err := q.Run()
	if err != nil {
		return nil, err
	}
	return jsonResp, nil
}
