import { combineReducers } from 'redux'
import dashboards  from './dashboard'


export default combineReducers({
  dashboards
})

// import { DASHBOARD_EDIT } from '../constants/actionTypes'
//
// import uuid from 'uuid'
//
// const initialState = {
//     // nfExporters: [],
//     // qry: {
//     //     id: uuid(),
//     //     from: '15m',
//     //     to: 'now',
//     //     nf: '.*'
//     // }
//
//     dashboardEdit: [],
// };



// function rootReducer(state = initialState, action) {
//     switch (action.type) {
//       // case LIST_EXPORTER:
//       //     state.nfExporters = []
//       //     return Object.assign({}, state, {
//       //         nfExporters: state.nfExporters.concat(...action.payload)
//       //     })
//       //
//       // case CHANGE_QUERY:
//       //     return Object.assign({}, state, {
//       //         qry: action.qry
//       //     })
//       case DASHBOARD_EDIT:
//         state.dashboardEdit = []
//         return Object.assign({}, state, {
//             dashboardEdit: state.dashboardEdit.concat(...action.payload)
//         })
//       default:
//           // return state
//     }
//
//     return state;
// };
