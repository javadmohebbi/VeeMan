import { ADD_DASHBOARD_LAYOUT, EDIT_DASHBOARD_LAYOUT, GET_DASHBOARD_LAYOUT, DELETE_DASHBOARD_LAYOUT } from "../constants/actionType"
import uuid from 'uuid'

// export const addDashboardLayout = dashboardLayout => ({
//   type: ADD_DASHBOARD_LAYOUT,
//   id: uuid(),
//   dashboardLayout
// })

export const addDashboardLayout = dashboardLayout => {
  return {
    type: ADD_DASHBOARD_LAYOUT,
    id: dashboardLayout.dashboardId,
    uuid: uuid(),
    layouts: dashboardLayout.layouts
  }
}


export const editDashboardLayout = dashboardLayout => {
  return {
    type: EDIT_DASHBOARD_LAYOUT,
    id: dashboardLayout.dashboardId,
    uuid: uuid(),
    layouts: dashboardLayout.layouts,
  }
}

export const deleteDashboardLayout = id => ({
  type: DELETE_DASHBOARD_LAYOUT,
  id
})

export const getDashboardLayout = id => ({
  type: GET_DASHBOARD_LAYOUT,
  id,
  uuid: uuid(),
})
