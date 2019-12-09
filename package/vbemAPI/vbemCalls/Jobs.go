package vbemCalls

import (
	"VeeamManager/package/vbemAPI"
	"VeeamManager/package/vbemAPI/vbemQuery"
	"log"
	"strings"
)

// HTTPPathGetJobInfo - Get a job info
const HTTPPathGetJobInfo = "/jobs/%UID%"

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

// GetJob - Get a job
func GetJob(sessionID string, jobUID string) ([]vbemAPI.Jobs, error) {
	uid := strings.Split(jobUID, ":")
	path := strings.Replace(HTTPPathGetJobInfo, "%UID%", uid[len(uid)-1], -1)

	q := vbemQuery.New(path, "GET", sessionID)
	jsonResp, err := q.Run()

	log.Println(jsonResp.String())

	if err != nil {
		log.Println("Can read convert XML to JSON ", err)
		return nil, err
	}

	refs := convertToJobs(vbemQuery.ExtractReferencesResponse(jsonResp.Bytes()))

	// refs, _ = BackupServersJob(sessionID, refs)
	// refs, _ = BackupServersRepos(sessionID, refs)
	// log.Println("Jobs: ", jobs)
	// log.Println("Repos: ", repos)
	//refs, _ = BackupServersCredentials(sessionId, refs)

	return refs, nil
}
