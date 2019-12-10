package vbemAPI

// OverviewReportFrame - Summary Overview parent node
type OverviewReportFrame struct {
	Summary SummaryOverview `json:"OverviewReportFrame"`
}

// SummaryOverview - Summary overview struct
type SummaryOverview struct {
	SuccessfulVMLastestStates string `json:"SuccessfulVmLastestStates"`
	FailedVMLastestStates     string `json:"FailedVmLastestStates"`
	BackupServers             string `json:"BackupServers"`
	ProxyServers              string `json:"ProxyServers"`
	RepositoryServers         string `json:"RepositoryServers"`
	RunningJobs               string `json:"RunningJobs"`
	ScheduledJobs             string `json:"ScheduledJobs"`
	WarningVMLastestStates    string `json:"WarningVmLastestStates"`
}

// VMsOverviewReportFrame - Virtual Machines Summary Overview parent node
type VMsOverviewReportFrame struct {
	Summary VMsSummaryOverview `json:"VmsOverviewReportFrame"`
}

// VMsSummaryOverview - VMs Summary overview struct
type VMsSummaryOverview struct {
	ProtectedVMs                string `json:"ProtectedVms"`
	BackedUpVMs                 string `json:"BackedUpVms"`
	ReplicatedVMs               string `json:"ReplicatedVms"`
	RestorePoints               string `json:"RestorePoints"`
	FullBackupPointsSize        string `json:"FullBackupPointsSize"`
	IncrementalBackupPointsSize string `json:"IncrementalBackupPointsSize"`
	ReplicaRestorePointsSize    string `json:"ReplicaRestorePointsSize"`
	SourceVMsSize               string `json:"SourceVmsSize"`
	SuccessBackupPercents       string `json:"SuccessBackupPercents"`
}

//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

// JobStatisticsReportFrame - JobStatistics parent node
type JobStatisticsReportFrame struct {
	StatisticsRepoFrame JobStatistics `json:"JobStatisticsReportFrame"`
}

// JobStatistics - struct for job Statistics
type JobStatistics struct {
	ScheduledJobs             string `json:"ScheduledJobs"`
	ScheduledBackupJobs       string `json:"ScheduledBackupJobs"`
	ScheduledReplicaJobs      string `json:"ScheduledReplicaJobs"`
	SuccessfulJobRuns         string `json:"SuccessfulJobRuns"`
	WarningsJobRuns           string `json:"WarningsJobRuns"`
	RunningJobs               string `json:"RunningJobs"`
	TotalJobRuns              string `json:"TotalJobRuns"`
	MaxJobDuration            string `json:"MaxJobDuration"`
	MaxBackupJobDuration      string `json:"MaxBackupJobDuration"`
	MaxDurationBackupJobName  string `json:"MaxDurationBackupJobName"`
	MaxDurationReplicaJobName string `json:"MaxDurationReplicaJobName"`
	FailedJobRuns             string `json:"FailedJobRuns"`
	MaxReplicaJobDuration     string `json:"MaxReplicaJobDuration"`
}
