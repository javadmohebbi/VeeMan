import React from 'react'
import { withTranslation } from 'react-i18next'

import Filter from './filter'



const QueryFilters = (props) => {

  const {t} = props
  const { UpdateFilters } = props
  const { queryId } = props
  // filters = [
  //    { field: null, value: null, logicalOperator: undefined, comparisonOperator: null }
  // ]
  // eslint-disable-next-line
  const [filters, setFilters] = React.useState(props.filters || [])

  // Add new filter at specific position
  const handleAddNewFilter = (filter, indexPosition) => {
    var flts = filters
    if (flts.length === 0 || indexPosition < 0 || indexPosition > flts.length-1 ) {
      flts.push(filter)
      handleUpdateFilter(filter, 0)
    } else {
      flts.splice(indexPosition, 0, filter)
      handleUpdateFilter(filter, indexPosition)
    }
  }

  // Create new empty filter
  const handleCreateNewEmptyFilter = () => {
    return {
      field: '', value: '', logicalOperator: ';', comparisonOperator: '=='
    }
  }

  // update filter
  const handleUpdateFilter = (filter, index=0) => {
    // console.log('update filter, q filters', filter, index);
    var flts = filters
    flts[index] = filter
    UpdateFilters(flts, queryId)
  }


  return (
    <>
      {/*
        filters.length === 0 ?
        <div>
          <button onClick={e => {e.preventDefault(); handleAddNewFilter(handleCreateNewEmptyFilter(), filters.length)}}
            className="btn btn-sm btn-warning">
            <i className="fas fa-plus"></i>
            {t('general.btn.addFilter')}
          </button>
        </div>
        :
        null
      */}
      <div className="col-sm-12 col-md-4 text-center mx-auto m-2">
        <button onClick={e => {e.preventDefault(); handleAddNewFilter(handleCreateNewEmptyFilter(), filters.length)}}
          className="btn btn-sm btn-warning">
          <i className="fas fa-plus"></i>
          {t('general.btn.addFilter')}
        </button>
      </div>
      {
        filters.map((filter, index) => (
          <Filter key={index} index={index} filter={filter}
            filtersLength={props.filters.length || 0}
            UpdateFilter={handleUpdateFilter}
            AddNewFilter={handleAddNewFilter}
            queryId={queryId}/>
        ))
      }
    </>
  )
}


export default withTranslation()(QueryFilters)
