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
