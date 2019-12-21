import React from 'react'
import {withTranslation} from 'react-i18next'
import { WidthProvider, Responsive } from "react-grid-layout";


import '../../../node_modules/react-grid-layout/css/styles.css'
import '../../../node_modules/react-resizable/css/styles.css'

import './dashboardWrapper.css'

const ResponsiveReactGridLayout = WidthProvider(Responsive);
const originalLayouts = getFromLS("layouts") || {};


class DashboardWrapper extends React.PureComponent {
    constructor(props) {
      super(props);

      this.state = {
        layouts: JSON.parse(JSON.stringify(originalLayouts)),
        dashboards: {},
        addDashboardModalShow: false
      };
    }

    static get defaultProps() {
      return {
        className: "layout",
        cols: { lg: 12, md: 10, sm: 6, xs: 4, xxs: 2, key: "hello" },
        rowHeight: 10
      };
    }


    componentDidMount() {
        getUsersDashboards().then(data => {
            this.setState({dashboards: data})
        })
    }




    onLayoutChange(layout, layouts) {
      saveToLS("layouts", layouts);
      this.setState({ layouts });
    }

    onCreateDashboardBtnClick(e) {
        this.setState( { addDashboardModalShow: !this.state.addDashboardModalShow})
    }

    render() {
      return (
        <div className="dashboardWrapper">

            {
                this.state.dashboards.length > 0 ?
                <div style={{width: '100%'}}>
                    <ResponsiveReactGridLayout
                        className="layout"

                        cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
                        rowHeight={10}

                        layouts={this.state.layouts}
                        onLayoutChange={(layout, layouts) =>
                        this.onLayoutChange(layout, layouts)
                        }
                    >
                        {/* <div className="widget-wrapper" key={'a'} data-grid={{ w: 2, h: 3, x: 0, y: 0, minW: 2, minH: 3 }}>
                        <span className="text">1</span>
                        </div> */}

                    </ResponsiveReactGridLayout>
                </div>
                :
                ''
            }

        </div>
      );
    }
  }

  function getFromLS(key) {
    let ls = {};
    if (global.localStorage) {
      try {
        ls = JSON.parse(global.localStorage.getItem("rgl-8")) || {};
      } catch (e) {
        /*Ignore*/
      }
    }
    return ls[key];
  }

  function saveToLS(key, value) {
    if (global.localStorage) {
      global.localStorage.setItem(
        "rgl-8",
        JSON.stringify({
          [key]: value
        })
      );
    }
  }


export default withTranslation()(DashboardWrapper)
