import React from 'react'
import { withTranslation } from 'react-i18next'
import LightSpinner from '../../../Loading/Spinner/Light';
import { ChromePicker } from 'react-color';
import { Link } from 'react-router-dom'
import uuid from 'uuid'

import './singleStat.css'

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
// console.log(rndQry);


const SingleStatChart = (props) => {
  const {busy, t, cssClasses, busyOnSave=true, busyOnData} = props

  const {stat='N.A.'} = props.chartPoints

  const {preText = null, postText = null } = props.chartPayload

  const { insideEditMode = true, editMode = true, title = '', itemIndex = '', removeEditUUID='' } = props
  const {removePanelFunc, itemSaved} = props

  const [displayColorPicker, setDisplayColorPicker] = React.useState({
    bg: false, pre: false, fg: false, pos: false
  })

  const [preColor, setPreColor] = React.useState(cssClasses.preColor || "#EFFBD5")
  const [color, setColor] = React.useState(cssClasses.color || "white")
  const [postColor, setPostColor] = React.useState(cssClasses.postColor || "#FBD5ED")
  const [bgColor, setBgColor] = React.useState(cssClasses.bgColor || "black")

  const [preTextState, setPreTextState] = React.useState(preText || '')
  const [postTextState, setPostTextState] = React.useState(postText || '')

  const [showEdit, setShowEdit] = React.useState(false)

  return (
    <>
    {
      busy
      ?
        <div className="chart">
        </div>
      :
        <div className="chart" onMouseOver={ () => setShowEdit(true)} onMouseLeave={() => setShowEdit(false)}>
        {
          insideEditMode ?
          <div className="editpanel mr-2 ml-2 mt-1 mb-1 text-center">

            <div className="input">
              <div className="col-sm-4 offset-sm-4">
                <label htmlFor="txtPre" className="sr-only">{t('general.inp.preText')}</label>
                <input type="text" id="txtPre"
                    maxLength={30}
                    value={preTextState} onChange={e => setPreTextState(e.target.value)}
                    className="form-control mb-3" placeholder={t('general.inp.preText')} required=""/>
              </div>
              <div className="col-sm-4 offset-sm-4">
                <label htmlFor="txtPost" className="sr-only">{t('general.inp.postText')}</label>
                <input type="text" id="txtPost"
                    maxLength={30}
                    value={postTextState} onChange={e => setPostTextState(e.target.value)}
                    className="form-control mb-3" placeholder={t('general.inp.postText')} required=""/>
              </div>
            </div>


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



            <div className="select-color">
            {
              preTextState !== '' ?
                <>
                <button className="btn btn-secondary btn-sm" onClick={ e => {e.preventDefault(); setDisplayColorPicker({...displayColorPicker, pre: true})} }>
                  <span className="colorBar" style={{background: preColor}}></span>
                  {t('general.btn.preColor')}
                </button>
                {
                  displayColorPicker.pre
                  ?
                    <div style={ popover }>
                      <div style={ cover } onClick={ e => {e.preventDefault(); setDisplayColorPicker({...displayColorPicker, pre: false})} } />
                      <ChromePicker color={preColor} onChangeComplete={ c => setPreColor(c.hex)}/>
                    </div>
                  : null
                }
                </>
              :
              null
            }
            </div>



            <div className="select-color">
            {
              stat !== '' ?
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



            <div className="select-color">
            {
              postTextState !== '' ?
                <>
                <button className="btn btn-secondary btn-sm" onClick={ e => {e.preventDefault(); setDisplayColorPicker({...displayColorPicker, pos: true})} }>
                  <span className="colorBar" style={{background: postColor}}></span>
                  {t('general.btn.postColor')}
                </button>
                {
                  displayColorPicker.pos
                  ?
                    <div style={ popover }>
                      <div style={ cover } onClick={ e => {e.preventDefault(); setDisplayColorPicker({...displayColorPicker, pos: false})} } />
                      <ChromePicker color={setPostColor} onChangeComplete={ c => setPostColor(c.hex)}/>
                    </div>
                  : null
                }
                </>
              :
              null
            }
            </div>

            <div className="select-color">
              <button className="btn btn-warning"
                onClick={e => {e.preventDefault(); props.saveCallBack({
                  cssClasses: {
                    preColor: preColor, postColor: postColor, color: color, bgColor: bgColor,
                  },
                  chartPayload: {
                    preText: preTextState, postText: postTextState
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
          <div className="inner">
            {
              busyOnData ?
              <LightSpinner spinnerSize="sm" />
              :
              <>
                {
                  preTextState !== '' ?
                  <span className="pretext" style={ {color: preColor } }>
                    {
                      preTextState
                    }
                  </span>
                  : ''
                }

                <span className="text" style={ {color: color } }>
                {
                  stat !== null ? stat : t('general.veeam.na')
                }
                </span>

                {
                  postTextState !== '' ?
                  <span className="posttext" style={ {color: postColor}  }>
                    {
                      postTextState
                    }
                  </span>
                  : ''
                }
              </>

            }
          </div>
        </div>
      </div>
    }
    </>
  )

}


export default withTranslation()(SingleStatChart)
