import React from 'react'
import { withTranslation } from 'react-i18next'
import { GetQueryTypes } from '../../configs/queryBuilder/queryTypes'

import uuidv1 from 'uuid/v1'

import QueryGrouping from './queryGrouping'
import QueryTabs from './queryTabs'
import { SaveQueryToServer } from '../../services/rawQuery/saveToServer'

import Toastification from '../Toastification/toastification'
import { toast } from 'react-toastify'

import './query.css'



const QueryBuilder = (props) => {

  const { t } = props

  const uuidQuery = uuidv1()

  const queryCountId = 0

  const containerId = 'queryBuilder'
  const [selectedType, setSelectedType] = React.useState(t('general.msg.nothingSelected'))
  const [busy, setBusy] = React.useState(false)

  const [wantedType, setWantedType] = React.useState([])
  const [showCol, setShowCol] = React.useState([])
  const [queryTitle, setQueryTitle] = React.useState(uuidQuery)

  const [queryId, setQueryID] = React.useState(uuidQuery)

  const [queries, setQueries] = React.useState([
    // queryId: 'xxxx-yyyyyyyy-zzzz-dddd'
    // filters: [
    //    { field: null, value: null, logicalOperator: undefined, comparisonOperator: null }
    // ]
  ])


  const hadnleToastMessage = (kind='success', message) => {
    switch (kind) {
      case 'error':
        toast.error(message, {containerId: containerId})
        return
      default:
        toast.success(message, {containerId: containerId})
        return
    }
  }


  const handleSelectTypeChange = (e) => {
    e.preventDefault()
    setSelectedType(e.target.value)

    setShowCol([])
    setWantedType([])

    var uid = uuidv1()
    setQueryTitle(uid)
    setQueryID(uid)
  }


  // Add Query
  const handleAddQuery = (qry) => {
    setQueries([...queries, qry])
  }

  // Remove Query
  const handleRemoveQuery = (qryIndex) => {
    var array = [...queries]; // make a separate copy of the array
    array.splice(qryIndex, 1);
    setQueries(array);
  }


  // Update Queries
  const handleUpdateQueries = (queryId, filters) => {
    var newQueries = queries.map((q) => {
      if (q.queryId === queryId) {
        return {...q, filters: filters }
      } else {
        return q
      }
    })
    setQueries(newQueries)
  }


  const handleSetBusy = (busy) => {
    setBusy(busy)
  }


  // Update Meta Data
  const handleUpdateResultMetaData = (newShowCol, newWantedType, newTitle='') => {
    if (newShowCol !== showCol) {
      setShowCol(newShowCol)
    }
    if (newWantedType !== wantedType) {
      setWantedType(newWantedType)
    }

    if (newTitle !== '' && newTitle !== queryTitle) {
      console.log(newTitle, queryTitle);
      setQueryTitle(newTitle)
    }
  }

  // Save
  const handleSaveQueryToServer = () => {
    var metadata = {
      showCol: showCol,
      wantedType: wantedType,
      title: queryTitle,
    }
    setBusy(true)
    SaveQueryToServer(queries, metadata, queryId || null).then(data => {
      if (data.hasOwnProperty('error') && data.error === true) {
        // Handle Errors
        hadnleToastMessage('error', data.message)
      } else {
        hadnleToastMessage('success', t('general.msg.dataSaved'))
      }
      setBusy(false)
    })
  }



  return (
    <>
      <Toastification containerId={containerId} />
      <div className="container-fluid pg-wrapper">
        {/* PAGE TITLE */}
        <div className="row">
          <div className="col-12">
              <h1 className="page-title pb-2">
                {t('general.nav.query')}
                {/*
                  busy ?
                  <LightSpinner spinnerSize="sm" />
                  :
                  null
                */}
              </h1>
          </div>
        </div>

        {/* BODY */}
        <div className="pg-body">
          {/* SUB HEADER */}
          <div className="pg-sb-header mt-2 mb-2">
            {/* Header content */}
            <div className="pg-qry">
              <div className="pg-qry-builder">

                {/* Option Query Type */}
                <div className="col-sm-12 col-md-6 pg-qry-run">
                  <label htmlFor="querytype" className="col-form-label">{t('general.inp.queryType')}</label>
                  <select id="querytype" disabled={busy} className="form-control" value={selectedType} onChange={handleSelectTypeChange}>
                      <option key={'nothingselected'} value={t('general.msg.nothingSelected')}>{t('general.msg.nothingSelected')}</option>
                      {
                        GetQueryTypes().map((item, index) => {
                          return (
                            <option key={index} value={item.cameleCase}>{item.queryType}</option>
                          )
                        })
                      }
                    </select>

                  {/*
                    queries.length > 0 ?
                    <button className="btn btn-warning ml-2">
                      <i className="fas fa-play"></i>
                      {t('general.btn.run')}
                    </button>
                    :
                    null
                  */}
                </div>

                {/*  QUERY Tabs  */}
                <div className="col-12 mt-4 mb-4">
                  <QueryTabs queries={queries} queryCountId={queryCountId} queryType={selectedType}
                    queryBuilderBusy={busy}
                    AddQuery={handleAddQuery}
                    RemoveQuery={handleRemoveQuery}
                    UpdateQuery={handleUpdateQueries}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* REST BODY */}
          <div className="pg-rest mt-2 mb-2">
            <QueryGrouping queries={queries}
              ToastMessage={hadnleToastMessage}
              UpdateBusy={handleSetBusy}
              SaveQueryToServer={handleSaveQueryToServer}
              wantedType={wantedType} showCol={showCol}
              queryTitle={queryTitle}
              queryId={queryId}
              UpdateMetaData={handleUpdateResultMetaData}
              queryType={selectedType === t('general.msg.nothingSelected') ? '' : selectedType} />
          </div>
        </div>
      </div>

    </>
  )
}


export default withTranslation()(QueryBuilder)
