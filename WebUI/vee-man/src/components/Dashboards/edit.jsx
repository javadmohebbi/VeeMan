import React from 'react'
import {withTranslation} from 'react-i18next'
import { getADashboard, UpdateDashboardLayout, updateDashboardTitle } from '../../services/dashboards'
import LightSpinner from '../Loading/Spinner/Light';
import { Link } from "react-router-dom";
import { useLocation } from "react-router";
import {getRows, setRows} from '../../services/localstorage'
import DashboardContainer from './Wrapper/container'

import uuidv1 from 'uuid/v1'

import { connect } from 'react-redux'
import { editDashboardLayout, getDashboardLayout } from '../../redux/actions'
import _ from 'lodash'

import jsonDefaultWidget from '../Dashboards/Default-Widgets-JSON/index.json'

import { SaveChartData } from '../../services/charts/saveChart'


import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


import './edit.css'


const mapStateToProps = state => {
  return {reduxDashbaordLayout: state}
}
// const mapStateToProps = state => ({
//   dashboardLayout: addDashboardLayout(state.dashboardLayout, state.layout)
// })
const mapDispatchToProps = dispatch => ({
  editDashboardLayoutFunc: id => dispatch(editDashboardLayout(id)),
  getDashboardLayoutFunc: id => dispatch(getDashboardLayout(id))
})




const EditDashboard = (props) => {

    const {t} = props


    const [dashboard, setDashboards] = React.useState({})

    const { editMode=true } = props

    React.useEffect(()=> {
      document.title = t('general.app.long') + (
        editMode ? ' | ' + t('general.btn.edit') : ' '
      )
    }, [t, editMode])



    // let h = useHistory();

    let l = useLocation();
    const showBackButton = l.search === "" ? true : false


    const id = props.match.params.id

    const [busy, setBusy] = React.useState(true)
    const [busyUpdate, setBusyUpdate] = React.useState(false)



    const [backupServerRows, setRowsBackupServers] = React.useState([])
    const [JobRows, setRowsJobs] = React.useState([])
    const [repoRows, setRowsRepo] = React.useState([])

    const [layoutFromServer,setLayoutFromServer] = React.useState({})

    const [isError, setIsError] = React.useState(false)

    // const [editMode, setEditMode] = React.useState(false)

    const [ addedElemets, setAddedElements ] = React.useState([])

    const [ layoutFromChild, setLayoutFromChild ] = React.useState([])

    const [editTitle, setEditTitle] = React.useState(false)
    const [txtTitle, setTxtTitle] = React.useState('')
    const [saveTitleBusy, setSaveTitleBusy] = React.useState(false)

    // const [defaultWidgets, setDefaultWidgets] = React.useState([])

    React.useEffect(() => {
      // console.log('red dash lay:', props.reduxDashbaordLayout);
      getDashboardLayout(id)
    }, [props.reduxDashbaordLayout, id])

    React.useEffect(() => {
      // const defWid = JSON.parse(jsonDefaultWidget)
      // console.log(jsonDefaultWidget);
    },[])

    React.useEffect(() => {
        getADashboard(id).then(data => {
            if (data.hasOwnProperty('error') && data.error === true) {
              setIsError(true)
            } else {
              setDashboards(data.dashboard)
              setTxtTitle(data.dashboard.Name)
              document.title = t('general.app.long') + (
                  editMode ? ' | ' + t('general.btn.edit') : ' '
                ) + ' | ' + data.dashboard.Name
              setLayoutFromServer(data.layouts)
              var fetchedElements = []
              _.map(data.layouts, (k,v) => {
                // console.log("k", k, "v", v);
                k.forEach((lay, k) => {
                  // console.log('lay', lay);
                  // console.log('len', addedElemets);
                  var el
                  var elType = lay.i.substring(0, lay.i.lastIndexOf('_'))
                  // var elInd = lay.i.substring(3,1)
                  var elUid = lay.i.substring(lay.i.lastIndexOf('_')+1);

                  // console.log(elType, "||||", elUid);

                  el = { uid: elUid, type:elType, w: lay.w, h: lay.h, isResizable: editMode ? lay.isResizable : false, isDraggable: editMode ? lay.isDraggable : false, x: lay.x, y: lay.y, saved: true }
                  if (fetchedElements.length === 0 ) {
                    // setAddedElements(addedElemets.concat(el))
                    fetchedElements.push(el)
                  } else {
                    var check = false
                    fetchedElements.forEach((adEl, index) => {
                      // console.log(adEl.uid, '=========', elUid);
                      if (adEl.uid === elUid) {

                        // setAddedElements(addedElemets.concat(el))
                        check = true
                        return;
                      }
                    })
                    if (!check) {
                      fetchedElements.push(el)
                    }
                  }
                })
              })

              setAddedElements(fetchedElements)
              setRows()
            }
            setBusy(false)
        })

    }, [id, editMode, t])

    React.useEffect(() => {
      if (!busy) {
        let localStorageRows = getRows()
        setRowsRepo(localStorageRows.Repositories)
        setRowsBackupServers(localStorageRows.BackupServers)
        setRowsJobs(localStorageRows.Jobs)
      }
    }, [busy])

    React.useEffect(() => {
      // console.log(backupServerRows);
    }, [backupServerRows])

    React.useEffect(() => {
      // console.log(JobRows);
    }, [JobRows])

    React.useEffect(() => {
      // console.log(JobRows);
    }, [repoRows])


    const handleAddRows = (e) => {
      e.preventDefault()
      var uid = { uid: uuidv1(), type:"row", w: 12, h: 5, isResizable: false, isDraggable: true, x:0, y:0, saved: false }
      setAddedElements(addedElemets.concat(uid))

    }

    const handleAddCols = (e) => {
      e.preventDefault()
      let uid = { uid: uuidv1(), type: "col", w: 6, h: 3, isResizable: true, isDraggable: true, x:0, y: 0, saved: false }
      setAddedElements(addedElemets.concat(uid))
      // console.log(addedElemets);
    }

    const handleAddDefaultCols = (e, defaultWidget) => {
      e.preventDefault()
      let uid = { uid: uuidv1(), type: "col", w: 6, h: 3, isResizable: true, isDraggable: true, x:0, y: 0, saved: false, chartData: {...defaultWidget} }
      setAddedElements(addedElemets.concat(uid))
    }

    const handleRemoveAddedElements = (newElementsObject) => {
      // setAddedElements(newElementsObject)
      setAddedElements(_.reject(addedElemets, {'uid': newElementsObject}))

    }

    const handleSaveDashboardLayout = () => {
      // console.log(layoutFromChild);
      setBusyUpdate(true)
      UpdateDashboardLayout({id: id, layouts: layoutFromChild}).then(data => {
        if (data.hasOwnProperty('error') && data.error === true) {
          // alert(data.message)
          toast.error(data.message, {containerId: 'editContainer'})
        } else {
          toast.success(t('titles.dashboardLayout') + ' ' + t('general.msg.dataSaved'), {containerId: 'editContainer'})
        }
        let arrElems = []
        addedElemets.forEach((item, ind) => {

          if (item.hasOwnProperty('chartData') && item.chartData !== undefined) {

            // console.log(item);
            const chData = {...item.chartData}
            // console.log(chData);
            let bodyData = {
              title: chData.Title,
              itemId: item.type+ind+item.uid,
              chartData: {
                ...chData.ChartData,
                panel: { type: 'panel', i18n: 'general.inp.panel', faIcon: 'fas fa-columns mr-2' },
                type: chData.ChartData.type
              },
            }
            SaveChartData(bodyData).then(data => {
              if (data.hasOwnProperty('error') && data.error === true) {
                // ERROR
              } else {
                // arrElems.push({...item, saved: true, chartData: undefined})
              }
              // arrElems.push({...item, saved: true, chartData: undefined})
            })
          }
          arrElems.push({...item, saved: true, chartData: undefined})
        })
        setAddedElements(arrElems)
        setBusyUpdate(false);
      })
    }

    const handleUpdateLayoutFromChild = (layouts) => {
      setLayoutFromChild(layouts)
    }


    const handleUpdateDashboardTitle = (e) => {
      e.preventDefault()
      setSaveTitleBusy(true)
      updateDashboardTitle(id, txtTitle).then(data => {
        if (data.hasOwnProperty('error') && data.error === true) {
          // alert(data.message)
          toast.error(data.message, {containerId: 'editContainer'})
        } else {
          toast.success(t('titles.dashboard') + ' ' + t('general.msg.changedTo') + ' "' + txtTitle + '"', {containerId: 'editContainer'})
        }
        setDashboards({...dashboard, Name: txtTitle})
        document.title = t('general.app.long') + (
            editMode ? ' | ' + t('general.btn.edit') : ' '
          ) + ' | ' + txtTitle
        setSaveTitleBusy(false)
        setEditTitle(false)
      })
    }

    return (
      <div>
        <div className="container-fluid" style={{height: '80px'}}>
          <ToastContainer enableMultiContainer containerId={'editContainer'} position={toast.POSITION.BOTTOM_RIGHT} />
            <div className="controller">
              <h5 className="page-title pb-3">
                {
                  showBackButton
                  ?
                  <Link className="btn btn-secondary mr-2" to="/dashboards">
                    <i className="fas fa-arrow-left"></i>
                  </Link>
                  :
                  <Link className="btn btn-secondary mr-2" to="/">
                    <i className="fas fa-arrow-left"></i>
                  </Link>
                }
                  { editMode ? t('titles.edit') + ":" : null } {
                    busy
                    ? <LightSpinner spinnerSize="sm" />
                  : <>
                    { !editTitle ?
                      <span className="text-warning">{dashboard.Name}</span>
                      :
                      <input type="text" className="form-control d-inline w-auto" value={txtTitle} onChange={e => setTxtTitle(e.target.value)} />
                    }
                    { editMode ?
                                <>
                                  {!editTitle
                                    ?
                                      <>
                                        <button onClick={e => {e.preventDefault(); setEditTitle(true)}} className="ml-2 btn btn-sm btn-warning"><i className="fas fa-pen mx-auto px-auto"></i></button>
                                        {/*<button className="btn btn-info" onClick={e => {e.preventDefault();handleSaveDefault()}} >save dafault</button> */}
                                      </>
                                    : <>
                                      {
                                          ! saveTitleBusy ?
                                          <>
                                            <button onClick={e => handleUpdateDashboardTitle(e)} className="ml-2 btn btn-sm btn-success"><i className="fas fa-save mx-auto px-auto"></i></button>
                                            <button onClick={e => {e.preventDefault(); setEditTitle(false)}} className="ml-2 btn btn-sm btn-danger">x</button>
                                          </>
                                          : <LightSpinner spinnerSize="sm" />
                                      }
                                      </>
                                  }
                                </>
                        : null
                    }
                    </>
                  }


                  {
                    isError === false && editMode ?
                    <div className="page-button" style={{float: 'right'}}>

                      {
                        jsonDefaultWidget.widgets.length > 0 ?
                        <div className="btn-group dropleft">
                          <button type="button" className="btn btn-secondary dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            {t('general.btn.addFromDefaultWidgets')}
                          </button>
                          <div className="dropdown-menu">
                            {
                              jsonDefaultWidget.widgets.map((grp, grpIndex) => {
                                return (
                                  <div className="p-0 dropdown-item dropleft dropdown-hover" key={`grp${grpIndex}`}>
                                    <span type="button" className="btn w-100 dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                      {t(grp.groupBy)}
                                    </span>
                                    <div className="dropdown-menu">
                                      {
                                        grp.items.map((item, itemIndex) => {
                                          return (
                                            <a key={`item${itemIndex}`} className="dropdown-item" href={`#addCol-default-${itemIndex}`} onClick={e => handleAddDefaultCols(e, item)}>
                                              <i className="fas fa-layer-group mr-2"></i>
                                              {item.Title}
                                            </a>
                                          )
                                        })
                                      }
                                    </div>
                                  </div>
                                )
                              })
                            }

                          </div>
                        </div>
                        :
                        null
                      }

                      <div className="btn-group dropleft">
                        <button type="button" className="btn btn-warning dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                          {t('general.btn.addPanel')}
                        </button>
                        <div className="dropdown-menu">
                          <a className="dropdown-item d-none" href="#addRow" onClick={handleAddRows}>
                            <i className="fas fa-layer-group mr-2"></i>
                            {t('general.btn.addRow')}
                          </a>
                          <div className="dropdown-divider d-none"></div>
                          <a className="dropdown-item" href="#addWidget" onClick={handleAddCols}>
                            <i className="fas fa-columns mr-2"></i>
                            {t('general.btn.addWidget')}
                          </a>
                        </div>

                        <a className="btn btn-info" target="_blank" rel="noopener noreferrer"  href={`/dashboard/view/${id}`}>
                          <i className="fas fa-eye mr-2"></i>
                          {t('general.btn.view')}
                        </a>
                        <button className="btn btn-success" onClick={handleSaveDashboardLayout}>
                          <i className="fas fa-save"></i>
                          {t('general.btn.save')}
                          {
                            busyUpdate ?
                            <LightSpinner spinnerSize="sm" />
                            :
                            ''
                          }
                        </button>

                      </div>
                    </div>
                  :
                    ''
                  }


              </h5>

            </div>
        </div>

        {
          isError === false ?
          <div className="container-fluid">
            <div className="row">
              <div className="col-12">
                {
                  addedElemets.length > 0 ?
                  <DashboardContainer dashbaordElements={addedElemets}
                    layoutFromServer={layoutFromServer} localStorageKey={id}
                    setLayoutCallBack={handleUpdateLayoutFromChild}
                    removeElemetCallBack={handleRemoveAddedElements}
                    dashboard={dashboard}
                    editMode={editMode}
                    widgetRows = { {bkupSrvs: backupServerRows, jobs: JobRows, repos: repoRows} }
                  />
                  :
                  ''
                }

              </div>
            </div>
          </div>
          :
          <div className="col-sm-12 text-center">
              <div className="card">
                  <div className="card-body">
                      <p className="card-text pt-3 pb-3 text-warning">
                          <i className="fas fa-exclamation-triangle mr-3"></i>
                          {t('general.err.server.connection')}
                      </p>
                  </div>
              </div>
          </div>
        }


      </div>
    )

}



export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withTranslation()(EditDashboard))
