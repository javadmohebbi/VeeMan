import i18n from '../../i18n'
import { WebUiConf } from '../../configs'
import { isAuthenticated } from '../auth'


export const DeleteQueryFromServer = (queryId) => {
  const t = i18n.getFixedT()

  // const apiURL = (`${process.env.REACT_APP_API_BASE}auth/login`)
  const apiURL = (`${WebUiConf().apiURL}/ui/delete/raw/query/${queryId}`)

  return fetch(apiURL, {
      method: "GET",
      headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
          "Authorization": isAuthenticated().token
      },
  })
  .then(response => response.json())
  .then(json => {
      if (json.hasOwnProperty('error') && json.error !== false) {
          return {
              message: t("general.err.get"),
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
