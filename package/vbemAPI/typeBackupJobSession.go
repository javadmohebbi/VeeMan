package vbemAPI

// BackupJobSession - struct
type BackupJobSession struct {
	BackupJobSession struct {
		// Links           interface{} `json:"Links"`
		EndTimeUTC      string `json:"EndTimeUTC"`
		CreationTimeUTC string `json:"CreationTimeUTC"`
		Href            string `json:"Href"`
		IsRetry         string `json:"IsRetry"`
		JobName         string `json:"JobName"`
		JobType         string `json:"JobType"`
		JobUID          string `json:"JobUid"`
		Name            string `json:"Name"`
		Progress        string `json:"Progress"`
		Result          string `json:"Result"`
		State           string `json:"State"`
		Type            string `json:"Type"`
		UID             string `json:"UID"`
	} `json:"BackupJobSession"`
}
