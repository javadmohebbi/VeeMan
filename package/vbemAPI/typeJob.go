package vbemAPI

// Jobs - struct
type Jobs struct {
	Name string `json:"Name"`
	Type string `json:"Type"`
	UID  string `json:"UID"`
	Href string `json:"Href"`
}

// JobsEntity - struct
type JobsEntity struct {
	Job struct {
		Links struct {
			Link []struct {
				Name string `json:"Name"`
				Type string `json:"Type"`
				Rel  string `json:"Rel"`
				Href string `json:"Href"`
			} `json:"Link"`
		} `json:"Links"`

		JobType string `json:"JobType"`

		Platform string `json:"Platform"`

		JobScheduleOptions struct {
			Standart interface{} `json:"Standart"`
		} `json:"JobScheduleOptions"`

		JobInfo struct {
			BackupJobInfo interface{} `json:"BackupJobInfo"`
		} `json:"JobInfo"`

		UID                string `json:"UID"`
		Name               string `json:"Name"`
		NextRun            string `json:"NextRun"`
		Type               string `json:"Type"`
		Href               string `json:"Href"`
		Description        string `json:"Description"`
		ScheduleConfigured string `json:"ScheduleConfigured"`
		ScheduleEnabled    string `json:"ScheduleEnabled"`
	} `json:"Job"`
}

// JobBackupSession - struct
type JobBackupSession struct {
	EntityReferences struct {
		// Ref []struct {
		// 	Name string `json:"Name"`
		// 	Type string `json:"Type"`
		// 	UID  string `json:"UID"`
		// 	Href string `json:"Href"`
		// 	// Links interface{} `json:"Links"`
		// } `json:"Ref"`
		Ref map[string]interface{} `json:"Ref"`
	} `json:"EntityReferences"`
}
