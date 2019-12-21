import i18n from '../../i18n'
import { WebUiConf } from '../../configs'
import { isAuthenticated } from '../auth'

export const SaveChartData = (data) => {
    const t = i18n.getFixedT()    

    // const apiURL = (`${process.env.REACT_APP_API_BASE}auth/login`)
    const apiURL = (`${WebUiConf().apiURL}/ui/dashboards/chart/data/set`)

    return fetch(apiURL, {
        method: "POST",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "Authorization": isAuthenticated().token
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(json => {
        if (json.hasOwnProperty('error') && json.error !== false) {
            return {
                message: t("general.err.charts.set"),
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
