
import { getApiRows } from '../dashboards'

const ROWS = 'rows'

export const getRows = () => {
  let st = {};
  if (global.localStorage) {
    try {
      st = JSON.parse(global.localStorage.getItem(ROWS))
    }
    catch(e) {
      //
    }
  }
  return st
}

export const setRows = () => {
  getApiRows().then(data => {
    if (data !== null && !data.hasOwnProperty('error')){
      if (global.localStorage) {
        global.localStorage.setItem(
          ROWS,
          JSON.stringify(data)
        );
      }
    }
  })
}
