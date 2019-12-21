import React from 'react'
import { withTranslation } from 'react-i18next'
import './container.css'
import { WidthProvider, Responsive } from "react-grid-layout";

import '../../../../node_modules/react-grid-layout/css/styles.css'
import '../../../../node_modules/react-resizable/css/styles.css'
// import Row from '../Row/row'

import Widget from '../Widget/widget'


import { connect } from 'react-redux'
import { editDashboardLayout, addDashboardLayout, deleteDashboardLayout } from '../../../redux/actions'



const mapStateToProps = state => {
  // console.log("state----> ", state);
  return {reduxDashbaordLayout: state}
}
// const mapStateToProps = state => ({
//   dashboardLayout: addDashboardLayout(state.dashboardLayout, state.layout)
// })
const mapDispatchToProps = dispatch => ({
  editDashboardLayoutFunc: (id, layout) => dispatch(editDashboardLayout(id, layout)),
  addDashboardLayoutFunc: (layout) => dispatch(addDashboardLayout(layout)),
  deleteDashboardLayoutFunc: (id) => dispatch(deleteDashboardLayout(id))
})





const ResponsiveReactGridLayout = WidthProvider(Responsive);

let lsKey = ''

const DashboardContainer = (props) => {
  // console.log(props);
  let dashboardElementsProps = props.dashbaordElements

  const {localStorageKey, layoutFromServer, widgetRows} = props
  lsKey = localStorageKey


  const [dashboardElems, setDashboardElems] = React.useState([])

  const [originalLayouts, setOriginalLayouts] = React.useState({});

  React.useEffect(() => {
    // console.log(layoutFromServer);
    saveToLS('layouts', layoutFromServer)
  }, [layoutFromServer])


  React.useEffect(()=> {
    setDashboardElems(dashboardElementsProps)
  }, [dashboardElementsProps])


  React.useEffect(() => {
    // console.log(props.reduxDashbaordLayout);
  }, [props.reduxDashbaordLayout])


  const [state, setState] = React.useState(
    {
      layouts: JSON.parse(JSON.stringify(originalLayouts)),
    }
  )

  React.useEffect(() => {
    // componentDidMount
    setOriginalLayouts(getFromLS("layouts") || {})
  },[])




  const onLayoutChange = (layout, layouts) => {
    saveToLS("layouts", layouts);
    setState({ ...state, layouts });

    props.setLayoutCallBack(layouts)

    if (props.reduxDashbaordLayout.dashboards.length === 0) {
      props.addDashboardLayoutFunc({dashboardId: props.localStorageKey, layouts})
    } else {
      props.editDashboardLayoutFunc({dashboardId: props.localStorageKey, layouts})
    }
  }

  const onRemoveItem = (i) => {
    if (dashboardElems.length === 1) {
      props.deleteDashboardLayoutFunc(lsKey)
      props.setLayoutCallBack({})
      deleteKeyFromLS(lsKey)
    }
    props.removeElemetCallBack(i)
  }


  return (
    <div style={{maxWidth: '100%'}}>
      {/* D a s h b o a r d  || = - = - = - >>  C o n t a i n e r */}

      <ResponsiveReactGridLayout
        className="layout"

        cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
        rowHeight={10}

        layouts={state.layouts}
        onLayoutChange={ (layout, layouts) => onLayoutChange(layout, layouts) }
      >

      {/*
      <div className="widget-wrapper" key={'a'} data-grid={{ w: 2, h: 3, x: 0, y: 0, minW: 2, minH: 3 }}>
        <span className="text">

        </span>
      </div>
      */}

      {
        dashboardElems.map ((item,i) => (
          <div className={item.type === 'row' ? "widget-wrapper dbl-border" : "widget-wrapper" } key={ item.type+'_'+item.uid } data-grid={{ w: item.w, h: item.h, x: item.x, y: item.y, minW: 2, minH: 3, isResizable: item.isResizable, isDraggable: item.isDraggable }}>
            <Widget removeItemFunc={onRemoveItem}
              dashboard={props.dashboard}
              item={item} itemIndex={i} editMode={props.editMode}
              widgetRows={widgetRows}/>
          </div>
        ))
      }


      </ResponsiveReactGridLayout>

    </div>
  )
}


function getFromLS(key) {
  let ls = {};
  if (global.localStorage) {
    try {
      ls = JSON.parse(global.localStorage.getItem(lsKey)) || {};
    } catch (e) {
      /*Ignore*/
    }
  }
  return ls[key];
}


function deleteKeyFromLS(key) {
  if (global.localStorage) {
    try {
      global.localStorage.removeItem(key)
    } catch (e) {
      /* Ignore */
    }
  }
}


function saveToLS(key, value) {
  if (global.localStorage) {
    global.localStorage.setItem(
      lsKey,
      JSON.stringify({
        [key]: value
      })
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withTranslation()(DashboardContainer))
