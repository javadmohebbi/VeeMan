package vbemCalls

import (
	"VeeamManager/package/vbemAPI"
	"VeeamManager/package/vbemAPI/vbemQuery"
	"encoding/json"
	"strings"
)

// HTTPReposPath - default path for Repos
const HTTPReposPath = "/repositories"

// HTTPGetARepoInfo - Get information about Repos
var HTTPGetARepoInfo = HTTPReposPath + "/%UID%"

func convertToRepos(refs []vbemAPI.Ref) []vbemAPI.Repositories {
	var tmp []vbemAPI.Repositories
	for _, e := range refs {
		tmpEl := vbemAPI.Repositories{
			Name: e.Name,
			Type: e.Type,
			UID:  e.UID,
			Href: e.Href,
		}
		tmp = append(tmp, tmpEl)
	}
	return tmp
}

// GetRepositoriesRelatedToBackupServer - get jobs related to a UID
func GetRepositoriesRelatedToBackupServer(bkupServerID string, sessionID string) ([]vbemAPI.RepositiryEntity, error) {
	path := strings.Replace(HTTPGetRepos, "%UID%", bkupServerID, -1)
	q := vbemQuery.New(path, "GET", sessionID)
	jsonResp, err := q.Run()
	if err != nil {
		return nil, err
	}
	backupServers := convertToBackupServers(vbemQuery.ExtractReferencesResponse(jsonResp.Bytes()))

	var reposEntities []vbemAPI.RepositiryEntity
	for _, j := range backupServers {
		var repoEnt vbemAPI.RepositiryEntity
		uid := strings.Split(j.UID, ":")
		path := strings.Replace(HTTPGetARepoInfo, "%UID%", uid[len(uid)-1], -1) + "?format=Entity"
		q := vbemQuery.New(path, "GET", sessionID)
		jsonResp, _ := q.Run()

		if err != nil {
			// Error
			return reposEntities, err
		}
		err = json.Unmarshal(jsonResp.Bytes(), &repoEnt)
		if err != nil {
			// Error
			return reposEntities, err
		}
		reposEntities = append(reposEntities, repoEnt)
	}
	return reposEntities, nil
}
