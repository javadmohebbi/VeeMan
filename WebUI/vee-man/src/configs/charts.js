
import { CHART_TYPE_SINGLE_STAT, CHART_TYPE_FIXED_TEXT, CHART_TYPE_LINE, CHART_TYPE_MIXED } from './chartTypes'
import {
  WHERE_TYPE_SEPARATOR_FIXED_TEXT,
  WHERE_TYPE_SUMMARY_OVERVIEW,
  WHERE_TYPE_SUMMARY_VMS_OVERVIEW,
  WHERE_TYPE_SUMMARY_STATISTICS,
  WHERE_TYPE_SUMMARY_PROTECTED_VMS,
  WHERE_TYPE_SUMMARY_REPOSITORIES,
} from './wheres'

import {
  DATA_TYPE_STRING, DATA_TYPE_INT, DATA_TYPE_BYTES,
  DATA_TYPE_PERCENT, DATA_TYPE_SECONDS,

} from './dataTypes/dataTypes'

import {
  getSummaryOverviewFromServer,
  getVMsSummaryOverviewFromServer,
  getJobStatisticsOverviewFromServer,
  getProcessedVMsFromServer,
  getRepositoryOverviewFromServer
} from '../services/charts/summaryOverview'

import _ from 'lodash'

/**
 * Separator - Fixed Text
 */
export const SEPARATOR_FIXED_TEXT_CHART = 'SEPARATOR_FIXED_TEXT_CHART'



/*
 * SUMMARY OVER VIEW
 */
export const SUM_OVER_SUCCESSFUL_VM_LATEST_STATES = 'sum_over_successful_vm_latest_states'
export const SUM_OVER_FAILED_VM_LATEST_STATES = 'sum_over_failed_vm_latest_states'
export const SUM_OVER_WARNING_VM_LATEST_STATES = 'sum_over_warning_vm_latest_states'
export const SUM_OVER_BACKUP_SERVERS = 'sum_over_backup_servers'
export const SUM_OVER_PROXY_SERVERS = 'sum_over_proxy_servers'
export const SUM_OVER_REPOSITORY_SERVERS = 'sum_over_repository_servers'
export const SUM_OVER_RUNNING_JOBS = 'sum_over_running_jobs'
export const SUM_OVER_SCHEDULED_JOBS = 'sum_over_scheduled_jobs'




/*
 * VMs SUMMARY OVER VIEW
 */
export const VM_SUM_OVER_PROTECTED_VMS = 'vm_sum_over_protected_vms'
export const VM_SUM_OVER_BACKUP_VMS = 'vm_sum_over_backup_vms'
export const VM_SUM_OVER_REPLICATED_VMS = 'vm_sum_over_replicated_vms'
export const VM_SUM_OVER_RESTORE_POINTS = 'vm_sum_over_restore_points'
export const VM_SUM_OVER_FULL_BACKUP_POINTS_SIZE = 'vm_sum_over_full_backup_points_size'
export const VM_SUM_OVER_INCREMENTAL_BACKUP_POINTS_SIZE = 'vm_sum_over_incremental_backup_points_size'
export const VM_SUM_OVER_REPLICA_RESTORE_POINTS_SIZE = 'vm_sum_over_replica_restore_points_size'
export const VM_SUM_OVER_SOURCE_VMS_SIZE = 'vm_sum_over_source_vms_size'
export const VM_SUM_OVER_SUCCESS_BACKUP_PERCENTS = 'vm_sum_over_success_backup_percents'



/*
 * Jobs Statistics
 */
export const JOB_STATISTICS_RUNNING_JOBS = 'job_statstics_RunningJobs'
export const JOB_STATISTICS_SCHEDULED_JOBS = 'job_statstics_ScheduledJobs'
export const JOB_STATISTICS_SCHEDULED_BACKUP_JOBS = 'job_statstics_ScheduledBackupJobs'
export const JOB_STATISTICS_SCHEDULED_REPLICA_JOBS = 'job_statstics_ScheduledReplicaJobs'
export const JOB_STATISTICS_TOTAL_JOB_RUNS = 'job_statstics_TotalJobRuns'
export const JOB_STATISTICS_SUCCESSFUL_JOB_RUNS = 'job_statstics_SuccessfulJobRuns'
export const JOB_STATISTICS_WARNINGS_JOB_RUNS = 'job_statstics_WarningsJobRuns'
export const JOB_STATISTICS_FAILED_JOB_RUNS = 'job_statstics_FailedJobRuns'
export const JOB_STATISTICS_MAX_JOB_DURAITON = 'job_statstics_MaxJobDuration'
export const JOB_STATISTICS_MAX_JOB_BACKUP_JOB_DURATION = 'job_statstics_MaxBackupJobDuration'
export const JOB_STATISTICS_MAX_REPLICA_JOB_DURATION = 'job_statstics_MaxReplicaJobDuration'
export const JOB_STATISTICS_MAX_DURATION_BACKUP_JOB_NAME = 'job_statstics_MaxDurationBackupJobName'
export const JOB_STATISTICS_MAX_DURATION_REPLICA_JOB_NAME = 'job_statstics_MaxDurationReplicaJobName'




/**
 * Processed Virtual Machines Summary
 */
export const PROCESSED_VMS_SUM = 'processedVMs_SUM'
export const PROCESSED_VMS_BACKEDUP = 'ProcessedVMs_BackedUp'
export const PROCESSED_VMS_REPLICATED = 'ProcessedVMs_Replicated'


/**
 * Repositories Summary
 */
export const REPOSITORY_SUM = 'Repository_Sum'
export const REPOSITORY_NAME = 'Repository_Name'
export const REPOSITORY_CAPACITY = 'Repository_Capacity'
export const REPOSITORY_FRREE_SPACE = 'Repository_FreeSpace'
export const REPOSITORY_BACKUP_SIZE = 'Repository_BackupSize'
export const REPOSITORY_FREE_PERCENT = 'Repository_FreePercent'


export const getAllChartsRelatedToWhere = (whereType) => {
  var filtered = _.map(getAllCharts() , f => { if (f.whereType === whereType) return f } )
  filtered = _.without(filtered, undefined)
  return filtered
}



export const getChartBasedOnType = (chartType) => {
  // console.log(chartType);
  var filtered = _.map(getAllCharts() , f => { if (f.type === chartType) return f } )
  filtered = _.without(filtered, undefined)
  return filtered[0]
}



export const getSeparatorChart = () => {
  /**
   * Separetor Fixed Type
   */
   return {
     type: SEPARATOR_FIXED_TEXT_CHART, i18n: 'SEPARATOR_FIXED_TEXT',
     chart: CHART_TYPE_FIXED_TEXT, cbFunc: undefined, dataType: DATA_TYPE_STRING,
     whereType: WHERE_TYPE_SEPARATOR_FIXED_TEXT
   }
}

const getAllCharts = () => {
  return [
    /**
     * Separetor Fixed Type
     */
    { type: SEPARATOR_FIXED_TEXT_CHART, i18n: 'SEPARATOR_FIXED_TEXT',
       chart: CHART_TYPE_FIXED_TEXT, cbFunc: undefined, dataType: DATA_TYPE_STRING,
       whereType: WHERE_TYPE_SEPARATOR_FIXED_TEXT },

    /**
     * SUMMARY OVERVIEW
     */
    { type: SUM_OVER_SUCCESSFUL_VM_LATEST_STATES, i18n: 'charts.sumOverSuccessfulVmLatestStat',
      chart: CHART_TYPE_SINGLE_STAT, cbFunc: getSummaryOverviewFromServer, dataType: DATA_TYPE_INT,
      responseJsonKey: 'SuccessfulVmLastestStates',
      whereType: WHERE_TYPE_SUMMARY_OVERVIEW },

    { type: SUM_OVER_FAILED_VM_LATEST_STATES, i18n: 'charts.sumOverFailedVmLatestStat',
      chart: CHART_TYPE_SINGLE_STAT, cbFunc: getSummaryOverviewFromServer, dataType: DATA_TYPE_INT,
      responseJsonKey: 'FailedVmLastestStates',
      whereType: WHERE_TYPE_SUMMARY_OVERVIEW },

    { type: SUM_OVER_WARNING_VM_LATEST_STATES, i18n: 'charts.sumOverWarningVmLatestStat',
      chart: CHART_TYPE_SINGLE_STAT, cbFunc: getSummaryOverviewFromServer, dataType: DATA_TYPE_INT,
      responseJsonKey: 'WarningVmLastestStates',
      whereType: WHERE_TYPE_SUMMARY_OVERVIEW },

    { type: SUM_OVER_BACKUP_SERVERS, i18n: 'charts.sumOverBackupServers',
      chart: CHART_TYPE_SINGLE_STAT, cbFunc: getSummaryOverviewFromServer, dataType: DATA_TYPE_INT,
      responseJsonKey: 'BackupServers',
      whereType: WHERE_TYPE_SUMMARY_OVERVIEW },

    { type: SUM_OVER_PROXY_SERVERS, i18n: 'charts.sumOverProxyServers',
      chart: CHART_TYPE_SINGLE_STAT, cbFunc: getSummaryOverviewFromServer, dataType: DATA_TYPE_INT,
      responseJsonKey: 'ProxyServers',
      whereType: WHERE_TYPE_SUMMARY_OVERVIEW },

    { type: SUM_OVER_REPOSITORY_SERVERS, i18n: 'charts.sumOverRepoServers',
      chart: CHART_TYPE_SINGLE_STAT, cbFunc: getSummaryOverviewFromServer, dataType: DATA_TYPE_INT,
      responseJsonKey: 'RepositoryServers',
      whereType: WHERE_TYPE_SUMMARY_OVERVIEW },

    { type: SUM_OVER_RUNNING_JOBS, i18n: 'charts.sumOverRunningJobs',
      chart: CHART_TYPE_SINGLE_STAT, cbFunc: getSummaryOverviewFromServer, dataType: DATA_TYPE_INT,
      responseJsonKey: 'RunningJobs',
      whereType: WHERE_TYPE_SUMMARY_OVERVIEW },

    { type: SUM_OVER_SCHEDULED_JOBS, i18n: 'charts.sumOverScheduledJobs',
      chart: CHART_TYPE_SINGLE_STAT, cbFunc: getSummaryOverviewFromServer, dataType: DATA_TYPE_INT,
      responseJsonKey: 'ScheduledJobs',
      whereType: WHERE_TYPE_SUMMARY_OVERVIEW },



    /**
     * VMs SUMMARY OVERVIEW
     */
    { type: VM_SUM_OVER_PROTECTED_VMS, i18n: 'charts.vmsSumOverProtectedVms',
      chart: CHART_TYPE_SINGLE_STAT, cbFunc: getVMsSummaryOverviewFromServer, dataType: DATA_TYPE_INT,
      responseJsonKey: 'ProtectedVms',
      whereType: WHERE_TYPE_SUMMARY_VMS_OVERVIEW },

    { type: VM_SUM_OVER_BACKUP_VMS, i18n: 'charts.vmsSumOverBackedUpVms',
      chart: CHART_TYPE_SINGLE_STAT, cbFunc: getVMsSummaryOverviewFromServer, dataType: DATA_TYPE_INT,
      responseJsonKey: 'BackedUpVms',
      whereType: WHERE_TYPE_SUMMARY_VMS_OVERVIEW },

    { type: VM_SUM_OVER_REPLICATED_VMS, i18n: 'charts.vmsSumOverReplicatedVms', dataType: DATA_TYPE_INT,
    chart: CHART_TYPE_SINGLE_STAT, cbFunc: getVMsSummaryOverviewFromServer,
    responseJsonKey: 'ReplicatedVms',
    whereType: WHERE_TYPE_SUMMARY_VMS_OVERVIEW },

    { type: VM_SUM_OVER_RESTORE_POINTS, i18n: 'charts.vmsSumOverRestorePoints', dataType: DATA_TYPE_INT,
    chart: CHART_TYPE_SINGLE_STAT, cbFunc: getVMsSummaryOverviewFromServer,
    responseJsonKey: 'RestorePoints',
    whereType: WHERE_TYPE_SUMMARY_VMS_OVERVIEW },

    { type: VM_SUM_OVER_FULL_BACKUP_POINTS_SIZE, i18n: 'charts.vmsSumOverFullBackupPointsSize',
    chart: CHART_TYPE_SINGLE_STAT, cbFunc: getVMsSummaryOverviewFromServer, dataType: DATA_TYPE_BYTES,
    responseJsonKey: 'FullBackupPointsSize',
    whereType: WHERE_TYPE_SUMMARY_VMS_OVERVIEW },

    { type: VM_SUM_OVER_INCREMENTAL_BACKUP_POINTS_SIZE, i18n: 'charts.vmsSumOverIncrementalBackupPointsSize',
    chart: CHART_TYPE_SINGLE_STAT, cbFunc: getVMsSummaryOverviewFromServer,  dataType: DATA_TYPE_BYTES,
    responseJsonKey: 'IncrementalBackupPointsSize',
    whereType: WHERE_TYPE_SUMMARY_VMS_OVERVIEW },

    { type: VM_SUM_OVER_REPLICA_RESTORE_POINTS_SIZE, i18n: 'charts.vmsSumOverReplicaRestorePointsSize',
    chart: CHART_TYPE_SINGLE_STAT, cbFunc: getVMsSummaryOverviewFromServer, dataType: DATA_TYPE_INT,
    responseJsonKey: 'ReplicaRestorePointsSize',
    whereType: WHERE_TYPE_SUMMARY_VMS_OVERVIEW },

    { type: VM_SUM_OVER_SOURCE_VMS_SIZE, i18n: 'charts.vmsSumOverSourceVmsSize',
    chart: CHART_TYPE_SINGLE_STAT, cbFunc: getVMsSummaryOverviewFromServer, dataType: DATA_TYPE_BYTES,
    responseJsonKey: 'SourceVmsSize',
    whereType: WHERE_TYPE_SUMMARY_VMS_OVERVIEW },

    { type: VM_SUM_OVER_SUCCESS_BACKUP_PERCENTS, i18n: 'charts.vmsSumOverSuccessBackupPercents',
    chart: CHART_TYPE_SINGLE_STAT, cbFunc: getVMsSummaryOverviewFromServer, dataType: DATA_TYPE_PERCENT,
    responseJsonKey: 'SuccessBackupPercents',
    whereType: WHERE_TYPE_SUMMARY_VMS_OVERVIEW },



    /**
     * Job Statistics
     */
    { type: JOB_STATISTICS_RUNNING_JOBS, i18n: 'charts.RunningJobs',
      chart: CHART_TYPE_SINGLE_STAT, cbFunc: getJobStatisticsOverviewFromServer, dataType: DATA_TYPE_INT,
      responseJsonKey: 'RunningJobs',
      whereType: WHERE_TYPE_SUMMARY_STATISTICS
    },
    { type: JOB_STATISTICS_SCHEDULED_JOBS, i18n: 'charts.ScheduledJobs',
      chart: CHART_TYPE_SINGLE_STAT, cbFunc: getJobStatisticsOverviewFromServer, dataType: DATA_TYPE_INT,
      responseJsonKey: 'ScheduledJobs',
      whereType: WHERE_TYPE_SUMMARY_STATISTICS
    },
    { type: JOB_STATISTICS_SCHEDULED_BACKUP_JOBS, i18n: 'charts.ScheduledBackupJobs',
      chart: CHART_TYPE_SINGLE_STAT, cbFunc: getJobStatisticsOverviewFromServer, dataType: DATA_TYPE_INT,
      responseJsonKey: 'ScheduledBackupJobs',
      whereType: WHERE_TYPE_SUMMARY_STATISTICS
    },
    { type: JOB_STATISTICS_SCHEDULED_REPLICA_JOBS, i18n: 'charts.ScheduledReplicaJobs',
      chart: CHART_TYPE_SINGLE_STAT, cbFunc: getJobStatisticsOverviewFromServer, dataType: DATA_TYPE_INT,
      responseJsonKey: 'ScheduledReplicaJobs',
      whereType: WHERE_TYPE_SUMMARY_STATISTICS
    },
    { type: JOB_STATISTICS_TOTAL_JOB_RUNS, i18n: 'charts.TotalJobRuns',
      chart: CHART_TYPE_SINGLE_STAT, cbFunc: getJobStatisticsOverviewFromServer, dataType: DATA_TYPE_INT,
      responseJsonKey: 'TotalJobRuns',
      whereType: WHERE_TYPE_SUMMARY_STATISTICS
    },
    { type: JOB_STATISTICS_SUCCESSFUL_JOB_RUNS, i18n: 'charts.SuccessfulJobRuns',
      chart: CHART_TYPE_SINGLE_STAT, cbFunc: getJobStatisticsOverviewFromServer, dataType: DATA_TYPE_INT,
      responseJsonKey: 'SuccessfulJobRuns',
      whereType: WHERE_TYPE_SUMMARY_STATISTICS
    },
    { type: JOB_STATISTICS_WARNINGS_JOB_RUNS, i18n: 'charts.WarningsJobRuns',
      chart: CHART_TYPE_SINGLE_STAT, cbFunc: getJobStatisticsOverviewFromServer, dataType: DATA_TYPE_INT,
      responseJsonKey: 'WarningsJobRuns',
      whereType: WHERE_TYPE_SUMMARY_STATISTICS
    },
    { type: JOB_STATISTICS_FAILED_JOB_RUNS, i18n: 'charts.FailedJobRuns',
      chart: CHART_TYPE_SINGLE_STAT, cbFunc: getJobStatisticsOverviewFromServer, dataType: DATA_TYPE_INT,
      responseJsonKey: 'FailedJobRuns',
      whereType: WHERE_TYPE_SUMMARY_STATISTICS
    },
    { type: JOB_STATISTICS_MAX_JOB_DURAITON, i18n: 'charts.MaxJobDuration',
      chart: CHART_TYPE_SINGLE_STAT, cbFunc: getJobStatisticsOverviewFromServer, dataType: DATA_TYPE_SECONDS,
      responseJsonKey: 'MaxJobDuration',
      whereType: WHERE_TYPE_SUMMARY_STATISTICS
    },
    { type: JOB_STATISTICS_MAX_JOB_BACKUP_JOB_DURATION, i18n: 'charts.MaxBackupJobDuration',
      chart: CHART_TYPE_SINGLE_STAT, cbFunc: getJobStatisticsOverviewFromServer, dataType: DATA_TYPE_SECONDS,
      responseJsonKey: 'MaxBackupJobDuration',
      whereType: WHERE_TYPE_SUMMARY_STATISTICS
    },
    { type: JOB_STATISTICS_MAX_REPLICA_JOB_DURATION, i18n: 'charts.MaxReplicaJobDuration',
      chart: CHART_TYPE_SINGLE_STAT, cbFunc: getJobStatisticsOverviewFromServer, dataType: DATA_TYPE_SECONDS,
      responseJsonKey: 'MaxReplicaJobDuration',
      whereType: WHERE_TYPE_SUMMARY_STATISTICS
    },
    { type: JOB_STATISTICS_MAX_DURATION_BACKUP_JOB_NAME, i18n: 'charts.MaxDurationBackupJobName',
      chart: CHART_TYPE_SINGLE_STAT, cbFunc: getJobStatisticsOverviewFromServer, dataType: DATA_TYPE_STRING,
      responseJsonKey: 'MaxDurationBackupJobName',
      whereType: WHERE_TYPE_SUMMARY_STATISTICS
    },
    { type: JOB_STATISTICS_MAX_DURATION_REPLICA_JOB_NAME, i18n: 'charts.MaxDurationReplicaJobName',
      chart: CHART_TYPE_SINGLE_STAT, cbFunc: getJobStatisticsOverviewFromServer, dataType: DATA_TYPE_STRING,
      responseJsonKey: 'MaxDurationReplicaJobName',
      whereType: WHERE_TYPE_SUMMARY_STATISTICS
    },



    /**
     * Processed VMS
     */
    { type: PROCESSED_VMS_BACKEDUP, i18n: 'charts.ProcessedVMs_BackedUp',
      chart: CHART_TYPE_LINE, cbFunc: getProcessedVMsFromServer, dataType: DATA_TYPE_STRING,
      responseJsonKey: 'Day', responseJsonChildKey: 'BackupedVms',  childType: DATA_TYPE_INT,
      whereType: WHERE_TYPE_SUMMARY_PROTECTED_VMS
    },
    { type: PROCESSED_VMS_REPLICATED, i18n: 'charts.ProcessedVMs_Replicated',
      chart: CHART_TYPE_LINE, cbFunc: getProcessedVMsFromServer, dataType: DATA_TYPE_STRING,
      responseJsonKey: 'Day', responseJsonChildKey: 'ReplicatedVms', childType: DATA_TYPE_INT,
      whereType: WHERE_TYPE_SUMMARY_PROTECTED_VMS
    },



    /**
     * Repository
     */
     { type: REPOSITORY_SUM, i18n: 'charts.RepositorySum',
       chart: CHART_TYPE_MIXED, cbFunc: getRepositoryOverviewFromServer, dataType: DATA_TYPE_STRING,
       responseJsonKey: 'Period', xs: [], ys: [],
       whereType: WHERE_TYPE_SUMMARY_REPOSITORIES
     },




  ]
}
