import React from 'react'
import { withTranslation } from 'react-i18next'
import { GetQueryString } from '../../configs/queryBuilder/jsonToQuery'
import LightSpinner from '../Loading/Spinner/Light';
import {RunRawQuery} from '../../services/rawQuery'

import QueryResult from './queryResult'
import './queryGrouping.css'

const logicals = [
 {name: ' AND ', value: ';'},
 {name: ' OR ', value: ','},
]

const QueryGrouping = (props) => {

  const { t } = props
  const { queries, queryType, ToastMessage, UpdateBusy } = props

  const [busy, setBusy] = React.useState(false)
  const [queryResult, setQueryResult] = React.useState(null)

  const [logicalOperator, setLogicalOperator] = React.useState([])

  const [queryString, setQueryString] = React.useState('')

  React.useEffect(()=>{
    UpdateBusy(busy)
  },[busy, UpdateBusy])

  React.useEffect(()=> {
    setQueryResult(null)
  }, [queryType])

  React.useEffect(() => {
    if (queries.length > 0) {
      setQueryString(GetQueryString(queries, logicalOperator, queryType))
    }
  }, [queries, logicalOperator, queryType])



  // Change Logical Operator
  const handleLogicalOperatorChange = (queryId, value) => {
    var opr = {}
    for (var i=0; i <= queries.length; i++) {
      if (queries[i].queryId === queryId) {
        opr = { queryId: queryId, operator: value }
        break;
      }
    }
    if (logicalOperator.length === 0) {
      setLogicalOperator([opr])
    } else {
      var arr = logicalOperator.map(lg => {
        if (lg.queryId === queryId) {
          return {
            queryId: queryId, operator: value
          }
        } else {
          return lg
        }
      })
      var check = true
      for (var j=0; j<arr.length; j++) {
        if (arr[j].queryId === queryId) {
          check = false
        }
      }
      if (check) { arr.push(opr) }
      setLogicalOperator(arr)
    }
  }



  const getLogicalOperator = (queryId) => {
    var lg=';'
    for (var i=0; i < logicalOperator.length; i++) {
      if (logicalOperator[i].queryId === queryId) {
        lg=logicalOperator[i].value;
        break;
      }
    }

    return lg;
  }

  // get query results from server
  const handleSendServerRequest = (q) => {
    setBusy(true)
    setQueryResult(null)
    RunRawQuery(q, queryType).then(data => {
      setBusy(false)
      if (data !== null) {
        if (data.hasOwnProperty('error') && data.error === true) {
          ToastMessage('error', data.message)
        } else {
          //
          // Valid Response from server
          //
          ToastMessage('success', t('general.err.rawQuery.success'))
          setQueryResult(data)
          return
        }
      } else {
        ToastMessage('error', t('general.err.rawQuery.null'))
      }

      setQueryResult(null)
      return

    })
  }

  return (
    <>
    {
      queries.length <= 1 ? null :
      <>
      {
        (queryType === t('general.msg.nothingSelected') || queryType === '') ? null
        :
        <div className="card text-white bg-dark mb-3">
        <div className="card-body pt-4">
          <div className="text grouping pt-4">
            {
              queries.map((qry, index) => (
                <div className="grp-item col-sm-6 col-md-3 col-lg-2 mb-4" key={index}>
                  <div className="input-group">
                  {
                    /* Check for first query and ommit Logical operator */
                    index > 0 ?
                    <div className="input-group-prepend">
                      <select disabled={busy} className="form-control text-center" value={getLogicalOperator(qry.queryId)}
                        onChange={e=> {e.preventDefault(); handleLogicalOperatorChange(qry.queryId, e.target.value)}}>
                        {
                          logicals.map((logical, index) => (
                            <option key={`lgc-${index}`} value={logical.value}>{logical.name}</option>
                          ))
                        }
                      </select>
                    </div>
                    :
                    null
                  }
                    <input className="form-control" type="text" readOnly={true} value={`qry(${qry.countId})`}/>
                  </div>
                </div>
              ))
            }
          </div>
        </div>
      </div>
      }
      </>
    }
    {
      (queryString === '' || queryString === null) && (queryType !== t('general.msg.nothingSelected') || queryType !== '')  ? null :
      <div className="card text-white bg-dark mb-3">
        <div className="card-body">
          <h5 className="card-title">{t('general.veeam.queryString')}</h5>
          <div className="card-text">
            <p>{queryString}</p>
            <button className="btn btn-warning"
              disabled={busy}
              onClick={e => {e.preventDefault(); handleSendServerRequest(queryString)}}
              >
              <i className="fas fa-play"></i>
              {t('general.btn.run')}
            </button>
            {
              !busy ? null :
              <span className="mx-2">
                <LightSpinner spinnerSize="sm"/>
              </span>
            }
          </div>
        </div>
      </div>
    }

    {/* show queryResult */}
    {
      queryResult === null ? null :
      <QueryResult queryResult={queryResult} queryType={queryType} busy={busy}/>
    }


    </>
  )
}


export default withTranslation()(QueryGrouping)
