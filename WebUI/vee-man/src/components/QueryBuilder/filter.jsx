import React from 'react'
import { withTranslation } from 'react-i18next'
import { GetTypeAHead } from '../../configs/queryBuilder/queryTypes'
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
  const { UpdateFilter, RemoveFilter, ChangePosition, queryBuilderBusy, queryType } = props

  const { filter=null, index, queryId } = props

  const [logicalOperator, setLogicalOperator] = React.useState(filter.logicalOperator)
  const [comparisonOperator, setComparisonOperator] =  React.useState(filter.comparisonOperator)

  const [typeAHeadArray, setTypeAHeadArray] = React.useState([])
  const [showTypeAHead, setShowTypeAHead] = React.useState(false)
  const [btnTypeAHeadClicked, setbtnTypeAHeadClicked] = React.useState(false)
  const [typeAHeadFilter, setTypeAFilter] = React.useState([])

  const refinputField = React.useRef(null);


  // Ref Input
  React.useEffect(() => {
    const { current } = refinputField;

    const handleFocus = () => {
      // console.log('input is focussed');
      setShowTypeAHead(true)
    }
    const handleBlur = () => {
      // console.log('input is blurred');
      // console.log(btnTypeAHeadClicked);
      if (!btnTypeAHeadClicked) {
        setShowTypeAHead(false)
      }
    }

    // const handleClick = () => {
    //   console.log('clicked');
    // }

    current.addEventListener('focus', handleFocus);
    current.addEventListener('blur', handleBlur);

    // btnCurrent.addEventListener('click', handleClick);

    return () => {
      current.removeEventListener('focus', handleFocus);
      current.removeEventListener('blur', handleBlur);

      // btnCurrent.addEventListener('click', handleClick);
    }
  });

  React.useEffect(()=> {
    // console.log(showTypeAHead);
  }, [showTypeAHead])


  React.useEffect(()=> {
    if (queryType !== null ) {
      var qtah = GetTypeAHead(queryType)
      setTypeAHeadArray(qtah)
      setTypeAFilter(qtah)
    }
  }, [queryType])

  React.useEffect(()=> {
    setComparisonOperator(filter.comparisonOperator)
  }, [filter.comparisonOperator])

  React.useEffect(()=> {
    setLogicalOperator(filter.logicalOperator)
  }, [filter.logicalOperator])

  // Update Filter
  const handleUpdateFilter = (filter, index) => {
    UpdateFilter(filter, index)
  }

  // Update Positon
  const handleChangePosition = (fromIndex, toIndex) => {
    ChangePosition(fromIndex, toIndex, queryId)
  }

  // Change Logical Operator
  const handleLogicalOperatorChange = (e) => {
    e.preventDefault()
    var flt = filter
    flt.logicalOperator = e.target.value
    handleUpdateFilter(flt, index)
    setLogicalOperator(e.target.value)
  }

  // Change Comparison Operator
  const handleComparisonOperatorChange = (e) => {
    e.preventDefault()
    var flt = filter
    flt.comparisonOperator = e.target.value
    handleUpdateFilter(flt, index)
    setComparisonOperator(e.target.value)
  }

  // Remove filter
  const hanelRemoveFilter = (removeIndex) => {
    RemoveFilter(removeIndex, queryId)
  }

  // Change filter field
  const handleFieldChange = (field, idx) => {
    var flt = filter
    flt.field = field
    handleUpdateFilter(flt, idx)
  }

  // Change filter field's value
  const handleValueChange = (value, idx) => {
    var flt = filter
    flt.value = value
    handleUpdateFilter(flt, idx)
  }

  // Move UP
  const handleMoveUp = (index) => {
    handleChangePosition(index-1, index)
  }

  // Move Down
  const handleMoveDown = (index) => {
    handleChangePosition(index, index + 1)
  }


  const handleOnMouseEnter = (e) => {
    e.preventDefault();
    setbtnTypeAHeadClicked(true)
  }
  const handleOnMouseOut = (e) => {
    e.preventDefault();
    setbtnTypeAHeadClicked(false)
  }

  return (
    <div className="filter-container m-3">
      <div className="form-row mx-auto text-center pr-2 pt-2 pl-2 pb-2">


          {/*Remove item*/}
          <div className="col-sm-12 col-md-1" onClick={e=>{e.preventDefault(); hanelRemoveFilter(index)}}>
              <button className="btn btn-danger" disabled={queryBuilderBusy}>
                <i className="fas fa-times mr-0"></i>
              </button>
          </div>

          {/* btn move up */}
          <div className="col-sm-12 col-md-1" onClick={e => {e.preventDefault();handleMoveUp(index)}}>
          {
            filtersLength > 0 && index !== 0 ?
              <button className="btn btn-info" disabled={queryBuilderBusy}>
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
              <select className="form-control text-center" disabled={queryBuilderBusy} value={logicalOperator} onChange={handleLogicalOperatorChange}>
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
              disabled={queryBuilderBusy}
              ref={refinputField}
              id="txtFilter"
              onChange={e => {e.preventDefault(); handleFieldChange(e.target.value, index)}}
              className="form-control" placeholder="Field" />
            {
              typeAHeadArray.length === 0 ? null :
              <>
              {
                typeAHeadFilter.length === 0 ? null :
                <>
                {
                  showTypeAHead === false ? null :
                  <div className="flt-typeahead bg-white shadow text-dark p-2">
                    {
                      typeAHeadFilter.map((f, thIndex)=> (
                        <div key={thIndex} className="tpa-item text-left">
                          <button
                            onMouseEnter={handleOnMouseEnter}
                            onMouseOut={handleOnMouseOut}
                            className="btn btn-light w-100 text-left" onClick={e => {
                              handleFieldChange(f.name, index);
                              setShowTypeAHead(false);
                            }}>
                            {f.name} -> {f.type}
                          </button>
                        </div>
                      ))
                    }
                  </div>
                }
                </>
              }

              </>
            }
          </div>

          {/* Comparison Operator */}
          <div className="col-sm-12 col-md-1">
            <select disabled={queryBuilderBusy} className="form-control text-center" value={comparisonOperator} onChange={handleComparisonOperatorChange}>
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
              disabled={queryBuilderBusy}
              onChange={e => {e.preventDefault(); handleValueChange(e.target.value, index)}}
              value={filter.value}
              className="form-control" placeholder="Value" />
          </div>

          {/* btn move down */}
          <div className="col-sm-12 col-md-1" onClick={e => {e.preventDefault();handleMoveDown(index)}}>
          {
            filtersLength > 0 && index !== filtersLength -1 ?
              <button className="btn btn-info" disabled={queryBuilderBusy}>
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
