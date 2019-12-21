package vbemCalls

import (
	"VeeamManager/package/vbemAPI"
	"VeeamManager/package/vbemAPI/vbemQuery"
	"encoding/json"
	"strings"
)

// HTTPJobsPath - default path for jobs
const HTTPJobsPath = "/jobs"

// HTTPGetAJobInfo - Get information about jobs
var HTTPGetAJobInfo = HTTPJobsPath + "/%UID%"

// HTTPGetJobBackupSessions - Get job backup session
var HTTPGetJobBackupSessions = HTTPJobsPath + "/%UID%/backupSessions?format=entities&sortAsc=name"

// convertToJobs - Refs to jobs
func convertToJobs(refs []vbemAPI.Ref) []vbemAPI.Jobs {
	var tmp []vbemAPI.Jobs
	for _, e := range refs {
		tmpEl := vbemAPI.Jobs{
			Name: e.Name,
			Type: e.Type,
			UID:  e.UID,
			Href: e.Href,
		}
		tmp = append(tmp, tmpEl)
	}
	return tmp
}

// GetJobsRelatedToBackupServer - get jobs related to a UID
func GetJobsRelatedToBackupServer(bkupServerID string, sessionID string) ([]vbemAPI.JobsEntity, error) {
	path := strings.Replace(HTTPGetJobs, "%UID%", bkupServerID, -1)
	q := vbemQuery.New(path, "GET", sessionID)
	jsonResp, err := q.Run()
	if err != nil {
		return nil, err
	}
	jobs := convertToJobs(vbemQuery.ExtractReferencesResponse(jsonResp.Bytes()))

	var jobsEntities []vbemAPI.JobsEntity
	for _, j := range jobs {
		var jobEnt vbemAPI.JobsEntity
		uid := strings.Split(j.UID, ":")
		path := strings.Replace(HTTPGetAJobInfo, "%UID%", uid[len(uid)-1], -1) + "?format=Entity"
		q := vbemQuery.New(path, "GET", sessionID)
		jsonResp, err := q.Run()
		if err != nil {
			// Error
			return jobsEntities, err
		}
		err = json.Unmarshal(jsonResp.Bytes(), &jobEnt)
		if err != nil {
			// Error
			return jobsEntities, err
		}
		jobsEntities = append(jobsEntities, jobEnt)
	}

	return jobsEntities, nil
}

// GetJobSessionInfo - get job session info
func GetJobSessionInfo(jobID string, sessionID string) (interface{}, error) {
	path := strings.Replace(HTTPGetJobBackupSessions, "%UID%", jobID, -1)
	q := vbemQuery.New(path, "GET", sessionID)
	jsonResp, err := q.Run()
	if err != nil {
		return nil, err
	}

	// var jbs vbemAPI.JobBackupSession
	var jbs map[string]map[string]interface{}
	_ = json.Unmarshal(jsonResp.Bytes(), &jbs)

	refs := jbs["EntityReferences"]["Ref"]

	nm := ""
	var uid []string

	switch refs.(type) {
	case []interface{}:
		for _, v := range refs.([]interface{}) {
			nv := v.(map[string]interface{})
			if nm < nv["Name"].(string) {
				tmpUUID := nv["UID"].(string)
				uid = strings.Split(tmpUUID, ":")
				nm = nv["Name"].(string)
			}
		}
		break
	case map[string]interface{}:
		nvo := refs.(map[string]interface{})
		tmpUUID := nvo["UID"].(string)
		uid = strings.Split(tmpUUID, ":")
		break
	}

	return GetBackupSessionInfo(uid[len(uid)-1], sessionID)

}

// GetJobAllBackupSessionInfo - get job session info
func GetJobAllBackupSessionInfo(jobID string, sessionID string) (interface{}, error) {
	path := strings.Replace(HTTPGetJobBackupSessions, "%UID%", jobID, -1)
	q := vbemQuery.New(path, "GET", sessionID)
	jsonResp, err := q.Run()
	if err != nil {
		return nil, err
	}

	// var jbs vbemAPI.JobBackupSession
	var jbs map[string]map[string]interface{}
	_ = json.Unmarshal(jsonResp.Bytes(), &jbs)

	refs := jbs["EntityReferences"]["Ref"]

	var namesAndUIDs []vbemAPI.NamesAndUUIDJob

	var uid []string

	switch refs.(type) {
	case []interface{}:
		for _, v := range refs.([]interface{}) {
			nv := v.(map[string]interface{})
			uid = strings.Split(nv["UID"].(string), ":")
			namesAndUIDs = append(namesAndUIDs, vbemAPI.NamesAndUUIDJob{
				Name: nv["Name"].(string),
				UID:  uid[len(uid)-1],
			})
		}
		break
	case map[string]interface{}:
		nvo := refs.(map[string]interface{})
		tmpUUID := nvo["UID"].(string)
		uid = strings.Split(tmpUUID, ":")
		namesAndUIDs = append(namesAndUIDs, vbemAPI.NamesAndUUIDJob{
			Name: nvo["Name"].(string),
			UID:  uid[len(uid)-1],
		})
		break
	}

	var bjsArr []interface{}
	for _, k := range namesAndUIDs {
		bjs, err := GetBackupSessionInfo(k.UID, sessionID)
		if err == nil {
			bjsArr = append(bjsArr, bjs.BackupJobSession)
		}
	}

	return bjsArr, nil

}
