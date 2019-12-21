import {
  EDIT_DASHBOARD_LAYOUT,
  ADD_DASHBOARD_LAYOUT,
  GET_DASHBOARD_LAYOUT,
  DELETE_DASHBOARD_LAYOUT
} from "../constants/actionType"


import uuid from 'uuid'

const dashboards = (state = [], action) => {
  switch (action.type) {
    case ADD_DASHBOARD_LAYOUT:
      return [
        ...state,
        {
          id: action.id,
          ...action
        }
      ]
    case EDIT_DASHBOARD_LAYOUT:
      return state.map(dashbrd => {
        return dashbrd.id === action.id ? { ...action, uuid: uuid() } : dashbrd
      }
        // dashbrd.id === action.id ? { ...dashbrd, layouts: dashbrd.layouts, uuid: uuid() } : dashbrd
      )
    case DELETE_DASHBOARD_LAYOUT:
      // DELETE
      return state.filter(dash => { return dash.id !== action.id })

    case GET_DASHBOARD_LAYOUT:
      return state.map(dashbrd => {
        return dashbrd.id === action.id ? { ...action, uuid: uuid() } : []
      }
      )
    default:
      return state
  }
}

export default dashboards
