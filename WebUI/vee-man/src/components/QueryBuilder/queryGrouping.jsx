import React from 'react'
import { withTranslation } from 'react-i18next'
import { GetQueryString } from '../../configs/queryBuilder/jsonToQuery'

import './queryGrouping.css'

const logicals = [
 {name: ' AND ', value: ';'},
 {name: ' OR ', value: ','},
]

const QueryGrouping = (props) => {

  const { t } = props
  const { queries, queryType } = props

  const [logicalOperator, setLogicalOperator] = React.useState([])

  const [queryString, setQueryString] = React.useState('')

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

  // get logical operator
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


  return (
    <>
    {
      queries.length <= 1 ? null :
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
                      <select className="form-control text-center" value={getLogicalOperator(qry.queryId)}
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
    {
      queryString === '' || queryString === null ? null :
      <div className="card text-white bg-dark mb-3">
        <div className="card-body">
          <h5 className="card-title">{t('general.veeam.queryString')}</h5>
          <p className="card-text">{queryString}</p>
          <button className="btn btn-warning">
            <i className="fas fa-play"></i>
            {t('general.btn.run')}
          </button>
        </div>
      </div>
    }
    </>
  )
}


export default withTranslation()(QueryGrouping)
