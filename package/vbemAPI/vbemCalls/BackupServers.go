package vbemCalls

import (
	"VeeamManager/package/vbemAPI"
	"VeeamManager/package/vbemAPI/vbemQuery"
	"log"
	"strings"
)

// HTTPPath - Veeam Enterprise Manager API Path for list of backupServers
const HTTPPath string = "/backupServers"

// HTTPGetJobs - Veeam Enterprise Manager API Path for list of jobs
var HTTPGetJobs = HTTPPath + "/%UID%/jobs"

// HTTPGetRepos - Veeam Enterprise Manager API Path for list of repositories
var HTTPGetRepos = HTTPPath + "/%UID%/repositories"

// HTTPGetCreds - Veeam Enterprise Manager API Path for list of credentials
var HTTPGetCreds = HTTPPath + "/%UID%/credentials"

// HTTPGetPasswds - Veeam Enterprise Manager API Path for list of passwords
var HTTPGetPasswds = HTTPPath + "/%UID%/passwords"

// convertToBackupServers - Convert []Ref to []BackupServers
func convertToBackupServers(refs []vbemAPI.Ref) []vbemAPI.BackupServers {
	var tmp []vbemAPI.BackupServers
	for _, e := range refs {
		tmpEl := vbemAPI.BackupServers{
			Name: e.Name,
			Type: e.Type,
			UID:  e.UID,
			Href: e.Href,
			Jobs: nil,
		}
		tmp = append(tmp, tmpEl)
	}
	return tmp
}

// BackupServers - Get List of Backuo Servers
func BackupServers(sessionID string) ([]vbemAPI.BackupServers, error) {
	q := vbemQuery.New(HTTPPath, "GET", sessionID)
	jsonResp, err := q.Run()

	if err != nil {
		log.Println("Can read convert XML to JSON ", err)
		return nil, err
	}

	refs := convertToBackupServers(vbemQuery.ExtractReferencesResponse(jsonResp.Bytes()))

	refs, _ = BackupServersJob(sessionID, refs)
	refs, _ = BackupServersRepos(sessionID, refs)
	// log.Println("Jobs: ", jobs)
	// log.Println("Repos: ", repos)
	//refs, _ = BackupServersCredentials(sessionId, refs)

	return refs, nil
}

// BackupServersJob - Get Listof BackupServersJob
func BackupServersJob(sessionID string, refs []vbemAPI.BackupServers) ([]vbemAPI.BackupServers, error) {
	var tmpRefs []vbemAPI.BackupServers
	for _, e := range refs {
		uid := strings.Split(e.UID, ":")
		path := strings.Replace(HTTPGetJobs, "%UID%", uid[len(uid)-1], -1)
		q := vbemQuery.New(path, "GET", sessionID)
		jsonResp, err := q.Run()
		if err != nil {
			return refs, err
		}

		jobs := convertToJobs(vbemQuery.ExtractReferencesResponse(jsonResp.Bytes()))

		tmRef := vbemAPI.BackupServers(e)
		tmRef.Jobs = jobs

		tmpRefs = append(tmpRefs, tmRef)

	}
	return tmpRefs, nil
}

// BackupServersRepos - Get Listof BackupServersRepositories
func BackupServersRepos(sessionID string, refs []vbemAPI.BackupServers) ([]vbemAPI.BackupServers, error) {
	var tmpRefs []vbemAPI.BackupServers
	for _, e := range refs {
		uid := strings.Split(e.UID, ":")
		path := strings.Replace(HTTPGetRepos, "%UID%", uid[len(uid)-1], -1)
		q := vbemQuery.New(path, "GET", sessionID)
		jsonResp, err := q.Run()
		if err != nil {
			return refs, err
		}

		repositories := convertToRepos(vbemQuery.ExtractReferencesResponse(jsonResp.Bytes()))

		tmRef := vbemAPI.BackupServers(e)
		tmRef.Repos = repositories

		tmpRefs = append(tmpRefs, tmRef)

	}
	return tmpRefs, nil
}

// BackupServersCredentials - Get Listof BackupServersCredentials
func BackupServersCredentials(sessionID string, refs []vbemAPI.BackupServers) ([]vbemAPI.BackupServers, error) {
	var tmpRefs []vbemAPI.BackupServers
	for _, e := range refs {
		uid := strings.Split(e.UID, ":")
		path := strings.Replace(HTTPGetCreds, "%UID%", uid[len(uid)-1], -1)
		q := vbemQuery.New(path, "GET", sessionID)
		jsonResp, err := q.Run()

		if err != nil {
			return refs, err
		}

		credentials := convertToCredentials(vbemQuery.ExtractCredResponse(jsonResp.Bytes()))

		tmRef := vbemAPI.BackupServers(e)
		tmRef.Creds = credentials

		tmpRefs = append(tmpRefs, tmRef)

	}
	return tmpRefs, nil
}

//func BackupServersPasswords(sessionId string, refs []vbemAPI.BackupServers) ([]vbemAPI.BackupServers, error) {
//	var tmpRefs []vbemAPI.BackupServers
//	for _, e := range refs {
//		uid := strings.Split(e.UID, ":")
//		path := strings.Replace(HTTPGetPasswds, "%UID%", uid[len(uid)-1], -1)
//		q := vbemQuery.New(path, "GET", sessionId)
//		jsonResp, err := q.Run()
//		if err != nil {
//			return refs, err
//		}
//
//		passwords :=  convertToPasswords(vbemQuery.ExtractReferencesResponse(jsonResp.Bytes()))
//
//		tmRef := vbemAPI.BackupServers(e)
//		tmRef.Passwds = passwords
//
//		tmpRefs = append(tmpRefs, tmRef)
//
//	}
//	return tmpRefs, nil
//}
