import React from 'react'
import { withTranslation } from 'react-i18next'
import LightSpinner from '../../../Loading/Spinner/Light';
import { ChromePicker } from 'react-color';

import _ from 'lodash'

import uuid from 'uuid'
import { Link } from 'react-router-dom'

import Chart from "react-apexcharts";

import './mixedRadial.css'


const rndQry = uuid()



const popover = {
  position: 'absolute',
  zIndex: '2',
}
const cover = {
  position: 'fixed',
  top: '0px',
  right: '0px',
  bottom: '0px',
  left: '0px',
}




const MixedRadialChart = (props) => {

  const {busy, t, cssClasses, busyOnSave=true} = props
  const { insideEditMode = true, editMode = true, title = '', itemIndex = '', removeEditUUID='' } = props
  const {removePanelFunc, itemSaved} = props

  const [points, setPoints] = React.useState({options: {}, series: []})

  const {chartPoints=[]} = props

  const [displayColorPicker, setDisplayColorPicker] = React.useState({
    fg: false,
  })

  const [bgColor, setBgColor] = React.useState(cssClasses.bgColor || "black")

  const [showEdit, setShowEdit] = React.useState(false)


  const [showMixed, setShowMixed] = React.useState(false)



    React.useEffect(() => {
      if (chartPoints !== null) {
          if (!busy) {
            let cps = chartPoints.length !== undefined ? chartPoints :  _.values(chartPoints)
            if (cps.length > 0) {
              var labels = _.map(cps, cp => cp.Label)
              var series = []

              for (var i=0; i < cps.length; i++ ) {

                for (var j=0; j < cps[i].y.length; j++) {
                  if (cps[i].y[j].forMixed) {
                    series.push( parseFloat(cps[i].y[j].data) )
                  }
                }
              }

              if( series.length > 0 && labels.length > 0 ) {
                setShowMixed(true)
                setPoints(
                  {
                    options: {
                      labels: labels,
                      dataLabels: {
                        enabled: true,
                      },
                      legend: {
                        show: true,
                        position: 'right',
                        horizontalAlign: 'left',
                      },
                      responsive: [
                        {
                          breakpoint: 100,
                          options: {
                            plotOptions: {
                              radialBar: {
                                horizontal: false
                              }
                            },
                            legend: {
                              position: "bottom"
                            }
                          }
                        }
                      ],
                      radialBar: {
                        dataLabels: {
                          name: {
                            fontSize: '22px',
                          },
                          value: {
                            fontSize: '16px',
                          },
                          total: {
                            show: true,
                            label: 'Total',
                            formatter: function (w) {
                              // By default this function returns the average of all series. The below is just an example to show the use of custom formatter function
                              return 249
                            }
                          }
                        }
                      }
                    },
                    series: series,
                  }
                )
              }
            }
          }

      }
    }, [chartPoints, busy])





  return (
    <>
      {
        busy ?
          <div className="chart"></div>
        :
          <div className="chart" onMouseOver={ () => setShowEdit(true)} onMouseLeave={() => setShowEdit(false)}>
            {
              insideEditMode ?
                <div className="editpanel mr-2 ml-2 mt-1 mb-1 text-center" >

                    {/* BG COLOR */}
                    <div className="select-color">
                      <button className="btn btn-secondary btn-sm" onClick={ e => {e.preventDefault(); setDisplayColorPicker({...displayColorPicker, bg: true})} }>
                        <span className="colorBar" style={{background: bgColor}}></span>
                        {t('general.btn.bgColor')}
                      </button>
                      {
                        displayColorPicker.bg
                        ?
                          <div style={ popover }>
                            <div style={ cover } onClick={ e => {e.preventDefault(); setDisplayColorPicker({...displayColorPicker, bg: false})} } />
                            <ChromePicker color={bgColor} onChangeComplete={ c => setBgColor(c.hex)}/>
                          </div>
                        : null
                      }
                    </div>

                    {/* Save Button */}
                    <div className="select-color">
                      <button className="btn btn-warning"
                        onClick={e => {e.preventDefault(); props.saveCallBack({
                          cssClasses: {
                            bgColor: bgColor,
                          },
                          chartPayload: {
                            panel: true
                          }
                        })}}
                      >
                        <i className="fas fa-save"></i>
                        {t('general.btn.save')}
                        {
                          busyOnSave ?
                          <LightSpinner spinnerSize="sm" className="p-2"/>
                          :
                          ''
                        }
                      </button>
                    </div>

                </div>
              :
              <>
              <div className="editpanel widgetPanel mr-2 ml-2 mt-1 mb-1 text-center">
                { busy ? <LightSpinner spinnerSize="sm" /> : <span className="widgetTitle">{title}</span> }
                {
                  (editMode === true && showEdit === true) ?
                  <span style={{float:'right', position: 'absolute', right: '0' ,top: 0}}>
                    <button className="btn btn-danger btn-secondary pull-right btn-sm ml-1 mt-0" style={{float: "right"}}
                      onClick={removePanelFunc.bind(this, removeEditUUID.substring(removeEditUUID.lastIndexOf('_')+1))}
                    >x</button>
                    {
                      itemSaved ?
                      <Link to={{
                          pathname : `/widget/edit/${removeEditUUID}`,
                          search: `?rnd=${rndQry}`,
                          state: {
                            dashboard: props.dashboard,
                            widgetTypes: props.widgetTypes,
                            item: {...props.item, index: itemIndex},
                            hasPayload: true,
                            payload: {
                              title: title,
                              description: '',
                              panel: { type: 'panel', i18n: 'general.inp.panel', faIcon: 'fas fa-columns mr-2' },
                              relatedTo: {...props.needForEditChartData.relatedTo},
                              where: {...props.needForEditChartData.where},
                              chart: {...props.needForEditChartData.chart},
                              chartPayload: { ...props.needForEditChartData.chartPayload },
                              cssClasses: {...props.needForEditChartData.cssClasses}
                            }
                          }
                        }} className="btn btn-warning btn-sm pull-right mr-2" style={{float: "right"}} >
                        <i className='fas fa-poll mr-2'></i>
                        {t('general.btn.edit')}
                      </Link>
                      :
                      ''
                    }
                  </span>
                  :
                  null
                }
              </div>
              </>
            }

            <div className="cn" style={{background: bgColor}}>
              <div className="inner" style={{fontSize: '20px'}}>
                <span className="text" style={{width: '100%',height: '100%'}} >

                <>
                {
                  showMixed ?
                    <div>
                      <Chart series={points.series} options={points.options} type="radialBar" heigth={'100%'}  style={{maxHeight: '100%'}}/>
                    </div>
                  :
                  <LightSpinner spinnerSize="sm" className="p-2"/>
                }
                </>
                </span>
              </div>
            </div>
          </div>
      }
    </>
  )
}


export default withTranslation()(MixedRadialChart)
