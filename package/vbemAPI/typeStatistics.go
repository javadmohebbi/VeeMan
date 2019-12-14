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

// JobStatisticsReportFrame - Job Statistics parent node
type JobStatisticsReportFrame struct {
	Summary JobStatisticsReport `json:"JobStatisticsReportFrame"`
}

// JobStatisticsReport - JobStatistics struct
type JobStatisticsReport struct {
	RunningJobs               string `json:"RunningJobs"`
	ScheduledJobs             string `json:"ScheduledJobs"`
	ScheduledBackupJobs       string `json:"ScheduledBackupJobs"`
	ScheduledReplicaJobs      string `json:"ScheduledReplicaJobs"`
	TotalJobRuns              string `json:"TotalJobRuns"`
	SuccessfulJobRuns         string `json:"SuccessfulJobRuns"`
	WarningsJobRuns           string `json:"WarningsJobRuns"`
	FailedJobRuns             string `json:"FailedJobRuns"`
	MaxJobDuration            string `json:"MaxJobDuration"`
	MaxBackupJobDuration      string `json:"MaxBackupJobDuration"`
	MaxReplicaJobDuration     string `json:"MaxReplicaJobDuration"`
	MaxDurationBackupJobName  string `json:"MaxDurationBackupJobName"`
	MaxDurationReplicaJobName string `json:"MaxDurationReplicaJobName"`
}

// ProcessedVMsReportFrame - Processed VMs parent node
type ProcessedVMsReportFrame struct {
	Summary ProcessedVMsOverview `json:"ProcessedVmsReportFrame"`
}

// ProcessedVMsOverview - ProcessedVMs Overview struct
type ProcessedVMsOverview struct {
	Day []struct {
		BackupedVMs   string `json:"BackupedVms"`
		ReplicatedVMs string `json:"ReplicatedVms"`
		Timestamp     string `json:"Timestamp"`
	} `json:"Day"`
}

// RepositoryReportFrame - Repository parent node
type RepositoryReportFrame struct {
	Summary RepositoryOverview `json:"RepositoryReportFrame"`
}

// RepositoryOverview - Repository Overview struct
type RepositoryOverview struct {
	Period []RepositoryPeriodOverview `json:"Period"`
}

// RepositoryPeriodOverview - Repository Period Overview struct
type RepositoryPeriodOverview struct {
	Name        string `json:"Name"`
	Capacity    string `json:"Capacity"`
	FreeSpace   string `json:"FreeSpace"`
	BackupSize  string `json:"BackupSize"`
	FreePercent string `json:"FreePercent"`
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

// // JobStatisticsReportFrame - JobStatistics parent node
// type JobStatisticsReportFrame struct {
// 	StatisticsRepoFrame JobStatistics `json:"JobStatisticsReportFrame"`
// }
//
// // JobStatistics - struct for job Statistics
// type JobStatistics struct {
// 	ScheduledJobs             string `json:"ScheduledJobs"`
// 	ScheduledBackupJobs       string `json:"ScheduledBackupJobs"`
// 	ScheduledReplicaJobs      string `json:"ScheduledReplicaJobs"`
// 	SuccessfulJobRuns         string `json:"SuccessfulJobRuns"`
// 	WarningsJobRuns           string `json:"WarningsJobRuns"`
// 	RunningJobs               string `json:"RunningJobs"`
// 	TotalJobRuns              string `json:"TotalJobRuns"`
// 	MaxJobDuration            string `json:"MaxJobDuration"`
// 	MaxBackupJobDuration      string `json:"MaxBackupJobDuration"`
// 	MaxDurationBackupJobName  string `json:"MaxDurationBackupJobName"`
// 	MaxDurationReplicaJobName string `json:"MaxDurationReplicaJobName"`
// 	FailedJobRuns             string `json:"FailedJobRuns"`
// 	MaxReplicaJobDuration     string `json:"MaxReplicaJobDuration"`
// }
