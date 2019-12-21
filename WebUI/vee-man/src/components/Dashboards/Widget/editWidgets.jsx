import React from 'react'
import { withTranslation } from 'react-i18next'
import { Redirect } from 'react-router-dom'
import './editWidget.css'
import { SaveChartData } from '../../../services/charts/saveChart'

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { getAllFroms, getSeparatorFroms } from '../../../configs/froms'
import { getAllWheresRealatedToFrom } from '../../../configs/wheres'
import { getAllChartsRelatedToWhere, getSeparatorChart } from '../../../configs/charts'


let firstRender = true


const EditWidget = (props) => {
  var dashboard
  // var widgetTypes
  var item

  const { payload={title:null, panel:null, chart: {type: null, i18n: null}, where: null,chartPayload: null, cssClasses: null } } = props.location.state



  const [state, setState] = React.useState({
    title: payload.title || props.match.params.id,
    description: '',
    // panel: { type: 'row', i18n: 'general.inp.row', faIcon: 'fas fa-layer-group mr-2' },
    panel:  payload.panel ? {...payload.panel} : { type: 'panel', i18n: 'general.inp.panel', faIcon: 'fas fa-columns mr-2' },

    // FROM
    relatedTo: payload.where ? {...payload.relatedTo} : { type: '' },

    // WHERE
    where: payload.where ? {...payload.where} : { type: '' },

    // WANT
    chart: { type: payload.chart.Type || '', i18n: payload.chart.i18n || '' },
    chartBusy: false,
  })

  const [busyOnSave, setBusyOnSave] = React.useState(false)

  const [resData, setResData] = React.useState(payload.title ? null : undefined)

  const [separetor, setSeparetor] = React.useState(false)

  const [froms, setFroms] = React.useState([])
  const [wheres, setWheres] = React.useState([])

  const { t } = props

  React.useEffect(() => {
    document.title = t('general.app.long') + ' | ' + t('general.btn.edit')
      + ' | ' + state.title
  }, [t, state.title])


  // INIT DROPDOWNS
  React.useEffect(() => {
    let f = []
    getAllFroms().forEach((from) => {
      f.push(from)
    })
    setFroms(f)
  },[])

  React.useEffect(() => {
    if (state.relatedTo.type !== '') {
      // console.log(getAllWheresRealatedToFrom(state.relatedTo.type));
      setWheres (
        getAllWheresRealatedToFrom(state.relatedTo.type)
      )
    }
  }, [state.relatedTo])


  React.useEffect(() => {
    // if (state.where.type !== '' ) {
    //
    // }
  }, [wheres])

  React.useEffect(() => {
    // console.log(state.chart.cbFunc, resData);
    const callCallbackFunction = () => {
        setState({...state, chartBusy: true})

        state.chart.cbFunc(state).then(data => {
          if (data.hasOwnProperty('error') && data.error === true) {
            toast.error(data.message, {containerId: 'editPanels'})
          }
          setState({...state, chartBusy: false})
          setResData(data)
        })
    }

    if (state.chartBusy === false && state.chart.cbFunc !== undefined  && resData === null) {
      if (!firstRender) {
        setResData({stat: 'N/A'})
        callCallbackFunction()
      }
    }

    if (firstRender) {
      firstRender = false
      if (state.chart.type !== '' && (state.chart.component === undefined || state.chart.component === null)) {
        if (state.where.type !== '') {
          getAllChartsRelatedToWhere(state.where.type).forEach((c) => {
            if (state.chart.type === c.type) {
              setState({...state, chart: c})

            }
          })
        }
      }
    }

  }, [state, resData])

  React.useEffect(() => {
    if (separetor && state.relatedTo.type === '') {
      setState({
        ...state,
        relatedTo: getSeparatorFroms(),
        where: getAllWheresRealatedToFrom(getSeparatorFroms().type)[0],
        chart: getSeparatorChart(),
      })
    }
  }, [separetor, state])

  if (props.location.state === undefined) {
    return <Redirect to="/dashboards"/>
  }

  dashboard = props.location.state.dashboard;

  item = props.location.state.item



  const handleChangeFrom = (e, fr) => {
    e.preventDefault()
    if (fr.type !== state.relatedTo.type) {
      setState({...state, relatedTo: fr, where: {type: ''}})
    }
  }

  const handleChangeWhere = (e, i) => {
    e.preventDefault()
    setState({...state, where: i})
  }

  const handleChangePanelType = (e, type) => {
    e.preventDefault()
    var tp = {type: 'panel', i18n: 'general.inp.panel', faIcon: 'fas fa-columns mr-2'}
    if (type === 'row') {
      setState({...state, relatedTo: {...state.relatedTo, type: ''}})
      setSeparetor(true)
      tp = { type: 'row', i18n: 'general.inp.row', faIcon: 'fas fa-layer-group mr-2' }
    } else {
      setSeparetor(false)
    }
    setState({...state, panel: tp })
  }

  const handleChangeChart = (e, chart) => {
    e.preventDefault()
    setState({...state, chart: chart})
    setResData(null)
    // callCallbackFunction()
  }

  const handleSaveFromChild = (panelInfo) => {
    setBusyOnSave(true)
    let bodyData = {
      title: state.title,
      itemId: item.type+item.index+item.uid,
      chartData: {
        ...state,
        ...panelInfo,
        type: state.chart.chart.type
      },
    }
    bodyData.chartData.panel = undefined
    bodyData.chartData.chartBusy = undefined

    SaveChartData(bodyData).then(data => {
      if (data.hasOwnProperty('error') && data.error === true) {
        toast.error(data.message, {containerId: 'editPanels'})
      } else {
        toast.success(t('general.msg.dataSaved'), {containerId: 'editPanels'})
      }
      setBusyOnSave(false)
    })
  }



  return (
    <div className="box">
      <ToastContainer enableMultiContainer containerId={'editPanels'} position={toast.POSITION.BOTTOM_RIGHT} />
      <header>
        <div className="container-fluid editWidgetWrapper">
        <div className="ewd-header mt-2 mb-2">
          <h2>
            <a className="btn btn-secondary mr-2"
              href={`/dashboard/edit/${dashboard.Id}`}
            >
                <i className="fas fa-arrow-left"></i>
            </a>

            {t('titles.edit')} {t('titles.widget')}: {state.title !== '' ? state.title : props.match.params.id} <span className="text-warning">({t('titles.relatedTo')}: {dashboard.Name})</span>
          </h2>
        </div>

        <div className="ewd-editPanel mt-2 mb-2 p-3 row">
          <div className="mx-auto text-center" style={{width: "100%"}}>
            <div className="col-sm-8 offset-sm-2 col-md-9 offset-md-1 col-lg-6 offset-lg-3">
              <label htmlFor="inputTitle" className="sr-only">{t('general.inp.title')}</label>
              <input type="text" id="inputTitle"
                  maxLength={40}
                  value={state.title} onChange={e => setState({...state, title: e.target.value})}
                  className="form-control mb-3" placeholder={t('general.inp.title')} required=""/>
            </div>


            <div className="ewd-controls">
              {/* Panel Type */}
              <div className="dropdown mr-1 d-inline">
                <button className="btn btn-info btn-sm mr-1 dropdown-toggle mb-2" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                  {t('general.btn.panelType')} <i className="fas fa-angle-double-right mr-1 ml-1"></i>
                  <strong>
                  {
                    state.panel.type !== ''
                    ?
                    <> <i className={state.panel.faIcon}></i>{t(state.panel.i18n)} </> : <>{t('general.btn.panelType')}</>
                  }
                  </strong>
                </button>
                <div className="dropdown-menu mr-1">
                    <button className="dropdown-item" onClick={e => handleChangePanelType(e, 'row')}  href="#changeTypeToRow" >
                      <i className="fas fa-layer-group mr-2"></i>
                      {t('general.inp.row')}
                    </button>
                    <button className="dropdown-item" onClick={e => handleChangePanelType(e, 'panel')}>
                      <i className="fas fa-columns mr-2"></i>
                      {t('general.inp.panel')}
                    </button>
                </div>
              </div>

              {/* FROM Object */}
              {
                !separetor ?
                  <div className="dropdown mr-1 d-inline">
                    <button className="btn btn-info btn-sm mr-1 dropdown-toggle mb-2" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                      {t('general.btn.from')} <i className="fas fa-angle-double-right mr-1 ml-1"></i>
                      <strong>
                      {
                        state.relatedTo.type === ''
                        ?
                        <>{t('general.msg.nothingSelected')}</>
                        : <> {t(state.relatedTo.i18n)} </>
                      }
                      </strong>
                    </button>
                    <div className="dropdown-menu">
                      {
                        froms.map((r, index) => {
                          return (
                            <button key={index} className="dropdown-item" onClick={e => handleChangeFrom(e, r)}>
                              {t(r.i18n)}
                            </button>
                          )
                        })
                      }
                    </div>
                  </div>
                :
                  null
              }


              {/* Where */}
              {
                !separetor ?
                <>
                {
                  state.relatedTo.type !== '' ?
                  <div className="dropdown mr-1 d-inline">
                    <button className="btn btn-info btn-sm mr-1 dropdown-toggle mb-2" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                      {t('general.btn.where')} <i className="fas fa-angle-double-right mr-1 ml-1"></i>
                      <strong>
                      {
                        state.where.type === ''
                        ?
                        <>{t('general.msg.nothingSelected')}</>
                      : <> {t(state.where.i18n)} </>
                      }
                      </strong>
                    </button>
                    <div className="dropdown-menu">
                      {
                        wheres.map((w, index) => {
                          return (
                            <button key={index} className="dropdown-item" onClick={e => handleChangeWhere(e, w)}>
                              {t(w.i18n)}
                            </button>
                          )
                        })
                      }
                    </div>
                  </div>
                  :
                  ''
                }
                </>
                :
                null
              }



              {/* CHART */}
              { !separetor ?
                <>
                {
                  state.where.type !== '' ?
                  <div className="dropdown mr-1 d-inline">
                    <button className="btn btn-info btn-sm mr-1 dropdown-toggle mb-2" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                      {t('general.btn.chart')} <i className="fas fa-angle-double-right mr-1 ml-1"></i>
                      <strong>
                      {
                        state.chart.type === ''
                        ?
                        <>{t('general.msg.nothingSelected')}</>
                      : <> {t(state.chart.i18n)} </>
                      }
                      </strong>
                    </button>
                    <div className="dropdown-menu">
                      {
                        getAllChartsRelatedToWhere(state.where.type).map((c, index) => {
                          return (
                            <button key={index} className={state.chart.type === c.type ? "dropdown-item active" : "dropdown-item"}
                              onClick={e => handleChangeChart(e, c)}>
                              {t(c.i18n)}
                            </button>
                          )
                        })
                      }
                    </div>
                  </div>
                  :
                  ''
                }
                </>
                :
                null
              }


            </div>
          </div>
        </div>



      </div>
      </header>
      <section>

          {
            state.chart.type !== '' && (state.chart.chart !== undefined && state.chart.chart.component !== undefined) ?

                <state.chart.chart.component chartPoints={resData || {}}
                  chartPayload={payload.chartPayload === null ? {} : payload.chartPayload}
                  cssClasses={ payload.cssClasses === null ? {} : payload.cssClasses } item={item}
                  busyOnSave={busyOnSave}
                  title={state.title}
                  saveCallBack={handleSaveFromChild} busy={state.chartBusy}/>
            :
            ''
          }

      </section>

    </div>
  )
}


export default withTranslation()(EditWidget)
