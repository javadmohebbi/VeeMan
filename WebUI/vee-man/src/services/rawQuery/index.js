import i18n from '../../i18n'
import { WebUiConf } from '../../configs'
import { isAuthenticated } from '../auth'


export const RunRawQuery = (query, queryType) => {
    const t = i18n.getFixedT()
    // const apiURL = (`${process.env.REACT_APP_API_BASE}auth/login`)
    const apiURL = (`${WebUiConf().apiURL}/ui/run/raw/query`)
    const body = JSON.stringify({
        queryString: query
    })

    return fetch(apiURL, {
        method: "POST",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "Authorization": isAuthenticated().token
        },
        body: body
    })
    .then(response => response.json())
    .then(json => {
        if (json.hasOwnProperty('error') && json.error !== false) {
          return {
              message: t("general.err.query"),
              error: true
          }
        }
        // return json.result
        if (typeof json.result === 'string') {
          return null
        } else if (typeof json.result === 'object'){
          if (json.result.hasOwnProperty('QueryResult')) {
            if (json.result['QueryResult'].hasOwnProperty('Entities')) {
              return json.result['QueryResult']['Entities']
            } else if (json.result['QueryResult'].hasOwnProperty('Resources')) {
              return json.result['QueryResult']['Resources']
            }
          } else {
            return {
              message: t("general.err.query"),
              error: true
            }
          }
        } else {
          return null
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
