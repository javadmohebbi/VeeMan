package vbemCalls

import (
	"VeeamManager/package/vbemAPI"
	"VeeamManager/package/vbemAPI/vbemQuery"
	"encoding/json"
	"strings"
)

// HTTPBackupSessionPath - default path for backupSessions
const HTTPBackupSessionPath = "/backupSessions"

// HTTPGetBackupSessionPath - Get Backupsession Info
var HTTPGetBackupSessionPath = HTTPBackupSessionPath + "/%UID%?format=Entity&sortAsc=CreationTimeUTC"

// GetBackupSessionInfo - get job session info
func GetBackupSessionInfo(lastID string, sessionID string) (vbemAPI.BackupJobSession, error) {
	path := strings.Replace(HTTPGetBackupSessionPath, "%UID%", lastID, -1)
	q := vbemQuery.New(path, "GET", sessionID)
	jsonResp, err := q.Run()
	if err != nil {
		return vbemAPI.BackupJobSession{}, err
	}
	// log.Println("-----------------------------------------------")
	// log.Println(jsonResp.String())
	// log.Println("-----------------------------------------------")

	var bjs vbemAPI.BackupJobSession
	_ = json.Unmarshal(jsonResp.Bytes(), &bjs)

	return bjs, nil
}
