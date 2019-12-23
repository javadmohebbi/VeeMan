import React from 'react'
import { withTranslation } from 'react-i18next'
import { GetQueryTypes } from '../../configs/queryBuilder/queryTypes'

import QueryTabs from './queryTabs'

import Toastification from '../Toastification/toastification'
// import { toast } from 'react-toastify'

import './query.css'

const QueryBuilder = (props) => {

  const { t } = props

  const queryCountId = 0

  const containerId = 'queryBuilder'
  const [selectedType, setSelectedType] = React.useState(t('general.msg.nothingSelected'))

  const [queries, setQueries] = React.useState([
    // queryId: 'xxxx-yyyyyyyy-zzzz-dddd'
    // filters: [
    //    { field: null, value: null, logicalOperator: undefined, comparisonOperator: null }
    // ]
  ])

  React.useEffect(() => {
    // console.log(selectedType);
  }, [selectedType])

  const handleSelectTypeChange = (e) => {
    e.preventDefault()
    setSelectedType(e.target.value)
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
    console.log('update queries, q builder', filters, queryId);
    var newQueries = queries.map((q) => {
      if (q.queryId === queryId) {
        return {...q, filters: filters }
      } else {
        return q
      }
    })
    setQueries(newQueries)
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
                <div className="col-12 col-12 pl-0 pr-0">
                  <div className="col-sm-12 col-md-3 pr-0 pl-0">
                    <label htmlFor="querytype" className="col-12 col-form-label">Query Type</label>
                    <div className="col-12">
                      <select id="querytype" className="form-control" value={selectedType} onChange={handleSelectTypeChange}>
                        <option key={'nothingselected'} value={t('general.msg.nothingSelected')}>{t('general.msg.nothingSelected')}</option>
                        {
                          GetQueryTypes().map((item, index) => {
                            return (
                              <option key={index} value={item.cameleCase}>{item.queryType}</option>
                            )
                          })
                        }
                      </select>
                    </div>
                  </div>
                </div>

                {/*  QUERY Tabs  */}
                <div className="col-12 mt-4 mb-4">
                  <QueryTabs queries={queries} queryCountId={queryCountId} queryType={selectedType}
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
            Body
          </div>
        </div>
      </div>

    </>
  )
}


export default withTranslation()(QueryBuilder)
