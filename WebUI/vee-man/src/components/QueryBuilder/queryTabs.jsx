import React from 'react'
import { withTranslation } from 'react-i18next'
import uuidv1 from 'uuid/v1'

import QueryFilters from './queryFilters'

import './queryTabs.css'

export const QueryTabs = (props) => {

  const {t} = props

  const { AddQuery, RemoveQuery, UpdateQuery } = props

  const { queries, queryType=t('general.msg.nothingSelected') } = props

  const [ queryCountId, setQueryCountId ] = React.useState(props.queryCountId || 0)

  const [activeTabItem, setActiveTabItem] = React.useState(props.activeTabItem || 1)

  const handleItemChanged = (itemIndex) => {
    setActiveTabItem(itemIndex)
  }

  // Add Empty Query
  const handleAddNewEmptyQuery = (e) => {
    e.preventDefault()
    var qci = queryCountId+1
    var q = {
      countId: qci,
      queryId: uuidv1(),
      filters: []
    }
    setQueryCountId(qci)
    // if (queries.length === 0) { setActiveTabItem(qci) }
    AddQuery(q)
    setActiveTabItem(qci)
  }

  // Remove Query
  const handleRemoveQuery = (qryIndex, qryCountId) => {
    RemoveQuery(qryIndex)
    if (qryCountId === activeTabItem) {
      if (queries.length === 0) {
        setActiveTabItem(1)
      } else {
        if(typeof queries[qryIndex - 1] !== 'undefined') {
          setActiveTabItem(queries[qryIndex - 1].countId)
        } else if (typeof queries[qryIndex + 1] !== 'undefined') {
          setActiveTabItem(queries[qryIndex + 1].countId)
        } else {
          setActiveTabItem(1)
        }

      }
    }
  }

  // Update Query
  const handleUpdateQuery = (filters, queryId) => {
    console.log('update query - tabs',filters);
    UpdateQuery(filters, queryId)
  }

  return (
    <>
      <ul className="nav-dark nav nav-tabs" id="queriesTab" role="tablist">

        {
          /* Tabs Button */
          queries.map((query, index) => (
            <li key={index} className="nav-item">
              <span className={activeTabItem === query.countId ? 'nav-link active' : 'nav-link'}>
                <a onClick={e => {e.preventDefault(); handleItemChanged(query.countId)}}
                  id={'qry-tab-'+query.countId} data-toggle="tab" href={'#qry-tab-'+query.countId}
                  role="tab" aria-controls={'qry-tab-'+query.countId} aria-selected="true">
                  {`qry(${query.countId})`}
                </a>
                <button className="btn btn-sm btn-secondary" onClick={e => {e.preventDefault(); handleRemoveQuery(index, query.countId)}}>x</button>
              </span>
            </li>
          ))
        }
        {
          /* ADD NEW EMPTY QUERY */
          queryType !== t('general.msg.nothingSelected') ?
          <li className="nav-item btnadd">
            <a className='ml-2 mt-2 btn btn-sm btn-warning' href={'#add-query'}
              onClick = {handleAddNewEmptyQuery}
              role="tab" aria-controls={'add-query'} aria-selected="true">
              <i className="fas fa-plus"></i>
              {t('general.btn.addQuery')}
            </a>
          </li>
          :
          null
        }

      </ul>
      <div className="tab-content bg-tab" id="queriesTabContent">
        {
          /* Tabs Content */
          queries.map((query, index) => (
            <div key={index}
              className={activeTabItem === query.countId ? 'tab-pane fade show active' : 'tab-pane fade'}
              id={'qry-tab-'+query.countId} role="tabpanel" aria-labelledby={'qry-tab-'+query.countId}>

              <div className="pt-2 pb-2 px-2">

                <QueryFilters filters={query.filters} queryId={query.queryId} UpdateFilters={handleUpdateQuery}/>

              </div>
            </div>
          ))
        }
      </div>
    </>
  )

}


export default withTranslation()(QueryTabs)
