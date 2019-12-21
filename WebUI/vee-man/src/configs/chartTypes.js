import SingleStatChart from '../components/Dashboards/Charts/SingleStat/SingleStatChart'
import FixedTextChart from '../components/Dashboards/Charts/FixedText/FixedText'
import LineChart from '../components/Dashboards/Charts/Line/line'
// import MixedChart from '../components/Dashboards/Charts/MixedChart/mixedChart'
import MixedRadialChart from '../components/Dashboards/Charts/MixedRadial/mixedRadialChart'
// import {
//   getChartBackupServerJobsCount, getChartBackupServerRepositoriesCount
// } from '../services/charts/backupServers'

export const CHART_TYPE_SINGLE_STAT = { type: 'singleStat', component: SingleStatChart }
export const CHART_TYPE_FIXED_TEXT = { type: 'fixedText', component: FixedTextChart }
export const CHART_TYPE_LINE = { type: 'barChart', component: LineChart }
export const CHART_TYPE_MIXED = { type: 'mixedRadialChart', component: MixedRadialChart }


//
//
// export const JOB_COUNT = 'jobCount'
// export const SUCCESS_JOB_COUNT = 'jobCount_success'
// export const FAILED_JOB_COUNT = 'jobCount_failed'
// export const WARNING_JOB_COUNT = 'jobCount_warning'
// export const NOSTAT_JOB_COUNT = 'jobCount_noStat'
//
// export const REPO_COUNT = 'repoCount'
//
// export const GetListofChartRelatedToObjects = (type) => {
//   switch (type) {
//     case "BackupServers":
//       return getBackupCharts()
//     case "Repositories":
//
//       return []
//     case "Jobs":
//
//       return []
//     default:
//       return []
//   }
// }
//
// const getBackupCharts = () => {
//   return [
//     { type: REPO_COUNT, i18n: 'general.veeam.chart.repositoriesCount', chart: CHART_TYPE_SINGLE_STAT, cbFunc: getChartBackupServerRepositoriesCount  },
//
//     { type: JOB_COUNT, i18n: 'general.veeam.chart.jobsCount', chart: CHART_TYPE_SINGLE_STAT, cbFunc: getChartBackupServerJobsCount },
//     { type: SUCCESS_JOB_COUNT, i18n: 'general.veeam.chart.jobsCount_success', chart: CHART_TYPE_SINGLE_STAT, cbFunc: undefined },
//     { type: FAILED_JOB_COUNT, i18n: 'general.veeam.chart.jobsCount_failed', chart: CHART_TYPE_SINGLE_STAT, cbFunc: undefined },
//     { type: WARNING_JOB_COUNT, i18n: 'general.veeam.chart.jobsCount_warning', chart: CHART_TYPE_SINGLE_STAT, cbFunc: undefined },
//     { type: NOSTAT_JOB_COUNT, i18n: 'general.veeam.chart.jobsCount_noStat', chart: CHART_TYPE_SINGLE_STAT, cbFunc: undefined },
//
//   ]
// }
//
//
// export const GetTypeOfChart = (t) => {
//   switch (t) {
//     case JOB_COUNT:
//
//       return CHART_TYPE_SINGLE_STAT.type
//     case REPO_COUNT:
//       return CHART_TYPE_SINGLE_STAT.type
//     default:
//       return ''
//   }
// }
