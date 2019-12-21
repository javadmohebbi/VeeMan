import i18n from '../../i18n'
import { WebUiConf } from '../../configs'
import { isAuthenticated } from '../auth'
import { CHART_TYPE_SINGLE_STAT } from '../../configs/chartTypes'

// GET JOBS COUNT
export const getChartBackupServerJobsCount = (object) => {
    const t = i18n.getFixedT()

    // const apiURL = (`${process.env.REACT_APP_API_BASE}auth/login`)
    const apiURL = (`${WebUiConf().apiURL}/ui/dashboards/chart/data/get`)

    return fetch(apiURL, {
        method: "POST",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "Authorization": isAuthenticated().token
        },
        body: JSON.stringify(
          {
            type: CHART_TYPE_SINGLE_STAT.type,
            relatedTo: object.relatedTo,
            where: object.where,
            want: object.chart || object.want,
          }
        )

    })
    .then(response => response.json())
    .then(json => {
        if (json.hasOwnProperty('error') && json.error !== false) {
            return {
                message: t("general.err.charts.get"),
                error: true
            }
        }
        // return json.result
        return {
          i18n: json.i18n,
          stat: json.stat
        }
    })
    .catch(err => {
        return {
            message: t("general.err.server.connection"),
            error: true,
            err
        }
    })

}

// GET REPO COUNT
export const getChartBackupServerRepositoriesCount = (object) => {
    const t = i18n.getFixedT()

    // const apiURL = (`${process.env.REACT_APP_API_BASE}auth/login`)
    const apiURL = (`${WebUiConf().apiURL}/ui/dashboards/chart/data/get`)

    return fetch(apiURL, {
        method: "POST",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "Authorization": isAuthenticated().token
        },
        body: JSON.stringify(
          {
            type: CHART_TYPE_SINGLE_STAT.type,
            relatedTo: object.relatedTo,
            where: object.where,
            want: object.chart || object.want,
          }
        )

    })
    .then(response => response.json())
    .then(json => {
        if (json.hasOwnProperty('error') && json.error !== false) {
            return {
                message: t("general.err.charts.get"),
                error: true
            }
        }
        // return json.result
        return {
          i18n: json.i18n,
          stat: json.stat
        }
    })
    .catch(err => {
        return {
            message: t("general.err.server.connection"),
            error: true,
            err
        }
    })

}
