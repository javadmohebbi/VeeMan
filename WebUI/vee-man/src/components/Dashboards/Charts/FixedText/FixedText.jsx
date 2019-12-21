import React from 'react'
import { withTranslation } from 'react-i18next'
import LightSpinner from '../../../Loading/Spinner/Light';
import { ChromePicker } from 'react-color';

import uuid from 'uuid'
import { Link } from 'react-router-dom'

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


const FixedTextChart = (props) => {

  const {busy, t, cssClasses, busyOnSave=true} = props
  const { insideEditMode = true, editMode = true, title = '', itemIndex = '', removeEditUUID='' } = props
  const {removePanelFunc, itemSaved} = props

  const [displayColorPicker, setDisplayColorPicker] = React.useState({
    bg: false, fg: false,
  })

  const [color, setColor] = React.useState(cssClasses.color || "white")
  const [bgColor, setBgColor] = React.useState(cssClasses.bgColor || "black")


  const [showEdit, setShowEdit] = React.useState(false)

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


                    {/* FG COLOR */}
                    <div className="select-color">
                    {
                      title !== '' ?
                        <>
                        <button className="btn btn-secondary btn-sm" onClick={ e => {e.preventDefault(); setDisplayColorPicker({...displayColorPicker, fg: true})} }>
                          <span className="colorBar" style={{background: color}}></span>
                          {t('general.btn.textColor')}
                        </button>
                        {
                          displayColorPicker.fg
                          ?
                            <div style={ popover }>
                              <div style={ cover } onClick={ e => {e.preventDefault(); setDisplayColorPicker({...displayColorPicker, fg: false})} } />
                              <ChromePicker color={color} onChangeComplete={ c => setColor(c.hex)}/>
                            </div>
                          : null
                        }
                        </>
                      :
                      null
                    }
                    </div>


                    {/* Save Button */}
                    <div className="select-color">
                      <button className="btn btn-warning"
                        onClick={e => {e.preventDefault(); props.saveCallBack({
                          cssClasses: {
                            color: color, bgColor: bgColor,
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
                <span className="text" style={ {color: color } }>
                {
                  title !== null ? title : t('general.veeam.na')
                }
                </span>
              </div>
            </div>
          </div>
      }
    </>
  )
}



export default withTranslation()(FixedTextChart)
