import i18n from '../../i18n'
import { WebUiConf } from '../../configs'
import { isAuthenticated } from '../auth'


export const SaveQueryToServer = (queries, metadata, queryId=null) => {
  const t = i18n.getFixedT()

  // const apiURL = (`${process.env.REACT_APP_API_BASE}auth/login`)
  const apiURL = (`${WebUiConf().apiURL}/ui/save/raw/query`)

  return fetch(apiURL, {
      method: "POST",
      headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
          "Authorization": isAuthenticated().token
      },
      body: JSON.stringify({
        queries: queries,
        metadata: metadata,
        uid: queryId,
      })
  })
  .then(response => response.json())
  .then(json => {
      if (json.hasOwnProperty('error') && json.error !== false) {
          return {
              message: t("general.err.save"),
              error: true
          }
      }
      return json.result
  })
  .catch(err => {
      return {
          message: t("general.err.server.connection"),
          error: true,
          err
      }
  })
}
