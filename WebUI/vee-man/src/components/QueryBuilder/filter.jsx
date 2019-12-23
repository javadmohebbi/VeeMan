import React from 'react'
import { withTranslation } from 'react-i18next'

import './filter.css'

const comparisons = [
  {value: '>', name: '>'},
  {value: '<', name: '<'},
  {value: '==', name: '=='},
  {value: '!=', name: '!='},
  {value: '>=', name: '>='},
  {value: '<=', name: '<='},
]
const logicals = [
 {name: ' AND ', value: ';'},
 {name: ' OR ', value: ','},
]

const Filter = (props) => {

  const { filtersLength=0 } = props
  const { UpdateFilter, RemoveFilter } = props

  const { filter=null, index, queryId } = props

  const [logicalOperator, setLogicalOperator] = React.useState(logicals[0])

  const [comparisonOperator, setComparisonOperator] =  React.useState(comparisons[0])


  const handleUpdateFilter = (filter, index) => {    
    UpdateFilter(filter, index)
  }



  const handleLogicalOperatorChange = (e) => {
    e.preventDefault()
    setLogicalOperator(e.target.value)
  }
  const handleComparisonOperatorChange = (e) => {
    e.preventDefault()
    setComparisonOperator(e.target.value)
  }
  const hanelRemoveFilter = (removeIndex) => {
    RemoveFilter(removeIndex, queryId)
  }

  const handleFieldChange = (field, idx) => {
    var flt = filter
    flt.field = field
    handleUpdateFilter(flt, idx)
  }

  const handleValueChange = (value, idx) => {
    console.log(value);
  }

  return (
    <div className="filter-container m-3">
      <div className="form-row mx-auto text-center pr-2 pt-2 pl-2 pb-2">


          {/*Remove item*/}
          <div className="col-sm-12 col-md-1" onClick={e=>{e.preventDefault(); hanelRemoveFilter(index)}}>
              <button className="btn btn-danger">
                <i className="fas fa-times mr-0"></i>
              </button>
          </div>

          {/* btn move up */}
          <div className="col-sm-12 col-md-1">
          {
            filtersLength > 0 && index !== 0 ?
              <button className="btn btn-info">
                <i className="fas fa-caret-up mr-0"></i>
              </button>
            :
            null
          }
          </div>

          {/* Logical Operator */}
          <div className="col-sm-12 col-md-1">
          {
            index !== 0
            ?
              <select className="form-control text-center" value={logicalOperator} onChange={handleLogicalOperatorChange}>
                {
                  logicals.map((logical, index) => (
                    <option key={`lgc-${index}`} value={logical.value}>{logical.name}</option>
                  ))
                }
              </select>
            :
            null
          }
          </div>



          {/* Field */}
          <div className="col-sm-12 col-md-3">
            <input type="text" value={filter.field}
              onChange={e => {e.preventDefault(); handleFieldChange(e.target.value, index)}}
              className="form-control" placeholder="Field" />
          </div>

          {/* Comparison Operator */}
          <div className="col-sm-12 col-md-1">
            <select className="form-control text-center" value={comparisonOperator} onChange={handleComparisonOperatorChange}>
              {
                comparisons.map((c, index) => (
                  <option key={`lgc-${index}`} value={c.value}>{c.name}</option>
                ))
              }
            </select>
          </div>

          {/* Value */}
          <div className="col-sm-12 col-md-4">
            <input type="text"
              onChange={e => {e.preventDefault(); handleValueChange(e.target.value, index)}}
              className="form-control" placeholder="Value" />
          </div>

          {/* btn move down */}
          <div className="col-sm-12 col-md-1">
          {
            filtersLength > 0 && index !== filtersLength -1 ?
              <button className="btn btn-info">
                <i className="fas fa-caret-down mr-0"></i>
              </button>
            :
            null
          }
          </div>



        </div>
    </div>
  )
}


export default withTranslation()(Filter)
