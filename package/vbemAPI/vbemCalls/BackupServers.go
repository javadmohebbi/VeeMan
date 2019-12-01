package vbemCalls

import (
	"VeeamManager/package/vbemAPI"
	"VeeamManager/package/vbemAPI/vbemQuery"
	"log"
	"strings"
)

const HttpPath 				string = "/backupServers"
var HttpGetJobs				string = HttpPath + "/%UID%/jobs"
var HttpGetRepos			string = HttpPath + "/%UID%/repositories"
var HttpGetCreds			string = HttpPath + "/%UID%/credentials"
var HttpGetPasswds			string = HttpPath + "/%UID%/passwords"


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

func BackupServers(sessionId string) ([]vbemAPI.BackupServers, error) {
	q := vbemQuery.New(HttpPath, "GET", sessionId)
	jsonResp, err := q.Run()

	if err != nil {
		log.Println("Can read convert XML to JSON ", err)
		return nil, err
	}

	refs := convertToBackupServers(vbemQuery.ExtractReferencesResponse(jsonResp.Bytes()))

	//refs, _ = BackupServersJob(sessionId, refs)
	//refs, _ = BackupServersRepos(sessionId, refs)
	//refs, _ = BackupServersCredentials(sessionId, refs)

	return refs, nil
}

func BackupServersJob(sessionId string, refs []vbemAPI.BackupServers) ([]vbemAPI.BackupServers, error) {
	var tmpRefs []vbemAPI.BackupServers
	for _, e := range refs {
		uid := strings.Split(e.UID, ":")
		path := strings.Replace(HttpGetJobs, "%UID%", uid[len(uid)-1], -1)
		q := vbemQuery.New(path, "GET", sessionId)
		jsonResp, err := q.Run()
		if err != nil {
			return refs, err
		}

		jobs :=  convertToJobs(vbemQuery.ExtractReferencesResponse(jsonResp.Bytes()))

		tmRef := vbemAPI.BackupServers(e)
		tmRef.Jobs = jobs

		tmpRefs = append(tmpRefs, tmRef)

	}
	return tmpRefs, nil
}

func BackupServersRepos(sessionId string, refs []vbemAPI.BackupServers) ([]vbemAPI.BackupServers, error) {
	var tmpRefs []vbemAPI.BackupServers
	for _, e := range refs {
		uid := strings.Split(e.UID, ":")
		path := strings.Replace(HttpGetRepos, "%UID%", uid[len(uid)-1], -1)
		q := vbemQuery.New(path, "GET", sessionId)
		jsonResp, err := q.Run()
		if err != nil {
			return refs, err
		}

		repositories :=  convertToRepos(vbemQuery.ExtractReferencesResponse(jsonResp.Bytes()))

		tmRef := vbemAPI.BackupServers(e)
		tmRef.Repos = repositories

		tmpRefs = append(tmpRefs, tmRef)

	}
	return tmpRefs, nil
}

func BackupServersCredentials(sessionId string, refs []vbemAPI.BackupServers) ([]vbemAPI.BackupServers, error) {
	var tmpRefs []vbemAPI.BackupServers
	for _, e := range refs {
		uid := strings.Split(e.UID, ":")
		path := strings.Replace(HttpGetCreds, "%UID%", uid[len(uid)-1], -1)
		q := vbemQuery.New(path, "GET", sessionId)
		jsonResp, err := q.Run()



		if err != nil {
			return refs, err
		}

		credentials :=  convertToCredentials(vbemQuery.ExtractCredResponse(jsonResp.Bytes()))

		tmRef := vbemAPI.BackupServers(e)
		tmRef.Creds =  credentials

		tmpRefs = append(tmpRefs, tmRef)

	}
	return tmpRefs, nil
}

//func BackupServersPasswords(sessionId string, refs []vbemAPI.BackupServers) ([]vbemAPI.BackupServers, error) {
//	var tmpRefs []vbemAPI.BackupServers
//	for _, e := range refs {
//		uid := strings.Split(e.UID, ":")
//		path := strings.Replace(HttpGetPasswds, "%UID%", uid[len(uid)-1], -1)
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



