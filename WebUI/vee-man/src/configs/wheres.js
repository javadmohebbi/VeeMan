
import {FROM_TYPE_REPORT, FROM_TYPE_SEPARATOR} from './froms'

import _ from 'lodash'

export const WHERE_TYPE_SEPARATOR_FIXED_TEXT = 'SEPARATOR_FIXED_TEXT'

export const WHERE_TYPE_SUMMARY_OVERVIEW = 'summary_oveview'
export const WHERE_TYPE_SUMMARY_VMS_OVERVIEW = 'summary_vms_oveview'
export const WHERE_TYPE_SUMMARY_STATISTICS = 'summary_statistics'
export const WHERE_TYPE_SUMMARY_PROTECTED_VMS = 'summary_protected_vms'
export const WHERE_TYPE_SUMMARY_REPOSITORIES = 'summary_repositories'


export const getAllWheresRealatedToFrom = (fromType) => {
  var filtered = _.map(getAllWheres() , f => { if (f.fromType === fromType) return f } )
  filtered = _.without(filtered, undefined)  
  return filtered
}


const getAllWheres = () => {
  return [
    /**
     * SUMMARY OVERVIEW
     */
    { type: WHERE_TYPE_SUMMARY_OVERVIEW, i18n: 'wheres.summaryOverview', fromType: FROM_TYPE_REPORT },
    { type: WHERE_TYPE_SUMMARY_VMS_OVERVIEW, i18n: 'wheres.summaryVmsOverview', fromType: FROM_TYPE_REPORT },
    { type: WHERE_TYPE_SUMMARY_STATISTICS, i18n: 'wheres.summaryStatistics', fromType: FROM_TYPE_REPORT },
    { type: WHERE_TYPE_SUMMARY_PROTECTED_VMS, i18n: 'wheres.summaryProtectedVms', fromType: FROM_TYPE_REPORT },
    { type: WHERE_TYPE_SUMMARY_REPOSITORIES, i18n: 'wheres.summaryRepository', fromType: FROM_TYPE_REPORT },

    { type: WHERE_TYPE_SEPARATOR_FIXED_TEXT, i18n: 'SEPARATOR_FIXED_TEXT', fromType: FROM_TYPE_SEPARATOR },
  ]
}
