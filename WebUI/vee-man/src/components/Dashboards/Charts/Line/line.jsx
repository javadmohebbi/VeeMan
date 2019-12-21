import React from 'react'
import { withTranslation } from 'react-i18next'
import LightSpinner from '../../../Loading/Spinner/Light';
import { ChromePicker } from 'react-color';

import uuid from 'uuid'
import { Link } from 'react-router-dom'

import {Line} from 'react-chartjs-2';

// Generate random light color
const randomLightGenerator = () => {
  for (var i = 0, random = []; i < 3; i++) {
    random.push(Math.floor(Math.random()*256));
  }
  var rgb = random;
  if (rgb.reduce(function(a,b){ return a+b;}) < 127 * 3)  {
    return random
  }
  return randomLightGenerator()
}



// var l = randomLightGenerator()
//
// const data = {
//   labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
//   datasets: [
//     {
//       label: 'My First dataset',
//       backgroundColor: `rgba(${l[0]},${l[1]},${l[2]},0.2)`,
//       borderColor: `rgba(${l[0]},${l[1]},${l[2]},1)`,
//       borderWidth: 1,
//       hoverBackgroundColor: `rgba(${l[0]},${l[1]},${l[2]},0.4)`,
//       hoverBorderColor: `rgba(${l[0]},${l[1]},${l[2]},1)`,
//       data: [65, 59, 80, 81, 56, 55, 40]
//     }
//   ]
// };



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



const rndQry = uuid()


const LineChart = (props) => {
  const {busy, t, cssClasses, busyOnSave=true} = props
  const { insideEditMode = true, editMode = true, title = '', itemIndex = '', removeEditUUID='' } = props
  const {removePanelFunc, itemSaved} = props

  const [points, setPoints] = React.useState([])

  const {chartPoints} = props

  const [displayColorPicker, setDisplayColorPicker] = React.useState({
    fg: false,
  })

  const [bgColor, setBgColor] = React.useState(cssClasses.bgColor || "black")

  const [showEdit, setShowEdit] = React.useState(false)

  React.useEffect(() => {
    if (title !== '' && chartPoints !== null) {
      var result = Object.keys(chartPoints).map(function(key) {
        return chartPoints[key];
      });

      if (result.length > 0) {
        var labels = []
        var value = []
        result.forEach(e => {
          if ( e.hasOwnProperty('label') && e.hasOwnProperty('value') ) {
            labels.push(e['label'])
            value.push(e['value'])
          }
        })

        var l = randomLightGenerator()
        var data = {
          labels: labels,
          datasets: [
            {
              label: title,
              backgroundColor: `rgba(${l[0]},${l[1]},${l[2]},0.2)`,
              borderColor: `rgba(${l[0]},${l[1]},${l[2]},1)`,
              borderWidth: 1,
              hoverBackgroundColor: `rgba(${l[0]},${l[1]},${l[2]},0.4)`,
              hoverBorderColor: `rgba(${l[0]},${l[1]},${l[2]},1)`,
              data: value
            }
          ]
        };
        setPoints(data)
      }
    }

  }, [chartPoints, title])


React.useEffect(()=> {
  // console.log(points);
}, [points])

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
                  {
                    (editMode === true && showEdit === true) ?
                      <div className="editpanel widgetPanel mr-2 ml-2 mt-1 mb-1 text-center" style={{background: 'transparent', position: 'absolute', zIndex: '2', top: '0', right: '0', width: '150px'}}>
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
                                    relatedTo: {...props.needForEditChartData.relatedTo || {}},
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
                      </div>
                      :
                      null
                  }
                </>
            }

            <div className="cn" style={{background: bgColor}}>
              <div className="inner" style={{fontSize: '20px'}}>
                <span className="text" style={{width: '100%',height: '100%'}} >

                <>
                {
                  points.length !== 0 ?
                  <Line
                    data={points}
                    options={{
                      maintainAspectRatio: false
                    }}
                  />
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


export default withTranslation()(LineChart)
