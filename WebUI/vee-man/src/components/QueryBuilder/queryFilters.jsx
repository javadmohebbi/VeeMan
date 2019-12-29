import React from 'react'
import { withTranslation } from 'react-i18next'

import Filter from './filter'



const QueryFilters = (props) => {

  const {t} = props
  const { UpdateFilters, queryBuilderBusy, queryType } = props
  const { queryId } = props
  // filters = [
  //    { field: null, value: null, logicalOperator: undefined, comparisonOperator: null }
  // ]
  // eslint-disable-next-line
  const [filters, setFilters] = React.useState(props.filters || [])

  // Add new filter at specific position
  const handleAddNewFilter = (filter, indexPosition) => {
    var flts = filters
    if (flts.length === 0 || indexPosition < 0 || indexPosition > flts.length ) {
      flts.push(filter)
      handleUpdateFilter(filter, filters.length-1)
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
  const handleUpdateFilter = (filter, index) => {
    var flts = filters
    flts[index] = filter
    UpdateFilters(flts, queryId)
  }

  // Update Filter Position  < == >
  const handleChangeFilterPosition = (fromIndex, toIndex, queryId) => {
    let flts = filters;

    [flts[fromIndex], flts[toIndex]] = [flts[toIndex], flts[fromIndex]]
    UpdateFilters(flts, queryId)

  }

  // remove fitler
  const handleRemoveFilter = (removeIndex, queryId) => {
    const flts = filters
    UpdateFilters(flts.splice(removeIndex, 1), queryId)
  }

  return (
    <>
      <div className="col-sm-12 col-md-4 text-center mx-auto m-2">
        <button onClick={e => {e.preventDefault(); handleAddNewFilter(handleCreateNewEmptyFilter(), filters.length)}}
          className={`btn btn-sm btn-warning ${queryBuilderBusy ? 'disabled' : null}`}>
          <i className="fas fa-plus"></i>
          {t('general.btn.addFilter')}
        </button>
      </div>
      {
        filters.map((filter, index) => (
          <Filter key={index} index={index} filter={filter}
            queryBuilderBusy={queryBuilderBusy}
            filtersLength={props.filters.length || 0}
            UpdateFilter={handleUpdateFilter}
            RemoveFilter={handleRemoveFilter}
            AddNewFilter={handleAddNewFilter}
            ChangePosition={handleChangeFilterPosition}
            queryType={queryType === t('general.msg.nothingSelected') ? null : queryType }
            queryId={queryId}/>
        ))
      }
    </>
  )
}


export default withTranslation()(QueryFilters)
