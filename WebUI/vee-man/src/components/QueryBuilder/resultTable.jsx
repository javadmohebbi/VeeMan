import React from 'react'
import { withTranslation } from 'react-i18next'
import {
  FormatString, FormatPercentage, FormatSeconds,
  FormatNanoSeconds, FormatMiliSeconds, FormatFloatNumbers,
  FormatIntNumbers, FormatBytes, ExtractUID
} from '../../configs/dataTypes/convert'

import { GetPaginatedItems } from '../../configs/pagination'
import VeeManTablePagination from '../Table/pagination'


import _ from 'lodash'

import './resultTable.css'

const FormatDateStr = (str) => {
  let d = new Date(str)
  let fd = FormatString(d.toLocaleString())
  if (fd === 'Invalid Date') return 'N.A'
  return fd
}

const ResultTable = (props) => {
  const {t} = props
  const {result, UpdateMetaData } = props

  const [headers, setHeaders] = React.useState([])
  const [dataTypes, setDataTypes] = React.useState([])
  const [data, setData] = React.useState([])

  const [showCol, setShowCol] = React.useState(props.showCol || [])
  const [wantedType, setWantedType] = React.useState(props.wantedType || [])
  const [firstInit, setFirstInit] = React.useState(true)
  const [pagination,setPagination] = React.useState({
    page: 1,
    pageSize: 5,
    total: 0,
    total_pages: 1,
    data: []
  })

  const [filter, setFilter] = React.useState('')

  const ConvertedTypes = [
    { name: 'string', value: 'string', func: FormatString  },
    { name: 'percentage', value: 'percentage', func: FormatPercentage },
    { name: 'date', value: 'date', func: FormatDateStr },
    { name: 'seconds', value: 'seconds', func: FormatSeconds },
    { name: 'nano-seconds', value: 'nan-seconds', func: FormatNanoSeconds },
    { name: 'mili-seconds', value: 'mili-seconds', func: FormatMiliSeconds },
    { name: 'float', value: 'float', func: FormatFloatNumbers },
    { name: 'integer', value: 'integer', func: FormatIntNumbers },
    { name: 'bytes', value: 'bytes', func: FormatBytes },
    { name: 'uid', value: 'uid', func: ExtractUID },
  ]



  React.useEffect(() => {
    if (result !== null ) {
      if (result.hasOwnProperty('titles')) {
        setHeaders(result.titles)
      }
      if (result.hasOwnProperty('dataType')) {
        setDataTypes(result.dataType)
      }

      if (props.wantedType.length === 0 ) {
        if (result.hasOwnProperty('wantedType')) {
          setWantedType(result.wantedType)
        } else {
          if (result.hasOwnProperty('dataType')) {
            setWantedType(result.dataType)

          } else {
            setWantedType([])
          }
        }
      } else {
        setWantedType(props.wantedType)
      }

      if (result.hasOwnProperty('data')) {
        setData(result.data)
      }
    }
  }, [result, UpdateMetaData, props.wantedType])

  React.useEffect(() => {
    if (data.length > 0 && firstInit) {
      setFirstInit(false)
      setPagination(GetPaginatedItems(data, pagination.page, pagination.pageSize))
    }
  }, [data,firstInit, pagination])


  React.useEffect(() => {
    if (headers.length > 0 && showCol.length === 0) {
      if (props.showCol.length > 0 ) {
        setShowCol(props.showCol)
      } else {
        var sh = []
        for (var i=0; i<headers.length; i++) {
          sh.push(true)
        }
        setShowCol(sh)
        UpdateMetaData(sh, wantedType)
      }

    }
  }, [headers, showCol, props.showCol, UpdateMetaData, wantedType])



  const convertTo = (dt, v) => {
    if (dt === 'object') { return '[object]' }

    var filtered = _.map(ConvertedTypes , d => { if (d.value === dt) return d } )
    filtered = _.without(filtered, undefined)

    var converted = filtered.length > 0 ? filtered[0].func(v) : FormatString(v)
    return converted
  }


  // CHANGE
  const handleChangeConvertedType = (newType, index) => {
    let wt = [...wantedType]
    wt[index] = newType
    UpdateMetaData(showCol, wt)
    setWantedType(wt)
  }

  // CHANGE
  const handleChangeShowCols = (newShow, index) => {
    let scs = [...showCol]
    scs[index] = (newShow === 'true')

    UpdateMetaData(scs, wantedType)

    setShowCol(scs)
  }

  const TableHeaderConvert = ({dtp, ind}) => {
    if (showCol[ind]) {
      return (
        <th scope="col" key={dtp+'-'+ind} title={dtp} style={{whiteSpace: 'nowrap',overflow: 'hidden', textOverflow: 'ellipsis', verticalAlign: 'top'  }}>

          {
            dtp === "object" ? <>{dtp}</> :
            <>
              <div>
                <select style={{maxWidth: '100%'}} id={`convert-${ind}`} value={dtp} onChange={e => {e.preventDefault(); handleChangeConvertedType(e.target.value, ind)}}>
                  {
                    ConvertedTypes.map((item, j) => (
                      <option key={'opt-'+j} value={item.value}>{item.name}</option>
                    ))
                  }
                </select>
              </div>
            </>
          }
        </th>
      )
    } else {
      return null
    }
  }

  const TableHeader = ({ttl, ind}) => {
    if (showCol[ind]) {
      return (
        <th scope="col" key={ind} title={ttl} style={{whiteSpace: 'nowrap',overflow: 'hidden', textOverflow: 'ellipsis'  }}>
          {ttl}
        </th>
      )
    } else {
      return null
    }
  }

  const TableRow = ({data, index}) => {
      // console.log(data,wantedType);
      if (showCol[index]) {
        try {
          return (
            <td title={ convertTo( typeof wantedType[index] === 'undefined' ? 'string' : wantedType[index] , data) }
              style={{whiteSpace: 'nowrap',overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {/* typeof data === 'string' ? data : '[object]' */}
              {
                convertTo( typeof wantedType[index] === 'undefined' ? 'string' : wantedType[index] , data)
              }
            </td>
          )
        } catch(e) {
          console.log(e);
          return null
        }
        // console.log(data);
        // return (
        //   <>
        //   <td key={index} title={ 'data' }
        //     style={{whiteSpace: 'nowrap',overflow: 'hidden', textOverflow: 'ellipsis' }}>
        //     {
        //       'data'
        //     }
        //   </td>
        //   </>
        // )
      } else {
        return null
      }


  }

  const handleChangePagination = (page) => {
    setPagination(GetPaginatedItems(data, page, pagination.pageSize))
  }

  const handleTxtFilterChanged  = (e) => {
    var txt = e.target.value
    setFilter(txt)
    var defaultData = result.data

    if (txt === '') {
      setData(result.data)
      setPagination(GetPaginatedItems(defaultData, 1, pagination.pageSize))
    } else {
      var filtered = _.filter(defaultData, (d) => {
        for (var i=0; i<d.length; i++) {
          if (typeof d[i] === 'string' && d[i].toLowerCase().indexOf(txt.toLowerCase()) !== -1) {
            return true;
          }
        }
        return false;
      })
      setData(filtered)
      setPagination(GetPaginatedItems(filtered, 1, pagination.pageSize))
    }

  }

  return (
    <div className="rt-holder">
      {/* */
      <table className="table table-dark table-striped table-hover">
        <thead>
          <tr>
            {
              showCol.map((shc, index) => (
                <th scope="col" key={'shc-'+index} style={{whiteSpace: 'nowrap',overflow: 'hidden', textOverflow: 'ellipsis', verticalAlign: 'top'  }}>
                  <select style={{maxWidth: '100%'}} id={`sh-${index}`} value={shc} onChange={e => {e.preventDefault(); handleChangeShowCols(e.target.value, index)}}>
                    <option key={`true-${index}`} value={true}>{t('general.inp.show') + `(${headers[index]})`}</option>
                    <option key={`false-${index}`} value={false}>{t('general.inp.hide') + `(${headers[index]})`}</option>
                  </select>
                </th>
              ))
            }
          </tr>
        </thead>
      </table>
      /**/}


      {
        result !== null && result.data.length ?
        <div className="mr-3 ml-3 mb-3 float-left">
          <div className="input-group btn-group-sm">
            <div className="input-group-prepend">
              <span className="input-group-text" id="basic-addon1"><i className="fas fa-filter"></i></span>
            </div>
            <input type="text" className="form-control" placeholder={t('general.inp.filter')}
              size="40"
              aria-label={t('general.inp.filter')}
              onChange={handleTxtFilterChanged}
              value={filter} aria-describedby="basic-addon2" />
          </div>
        </div>
        :
        null
      }

      <VeeManTablePagination pagination={pagination} handleChangePagination={handleChangePagination} />

      <table className="table table-dark table-striped table-hover">
        <thead>
        {
          headers.length <= 0 ? null :
            <tr key={'header'}>
              {
                headers.map((ttl, ind) => (
                  <TableHeader key={'ttl'+ind} ttl={ttl} ind={ind} />
                ))
              }
            </tr>
        }
        {
          dataTypes.length <= 0 ? null :
            <tr key={'dts'}>
              {
                wantedType.map((dtp, ind) => (
                <TableHeaderConvert key={'th-'+ind} dtp={dtp} ind={ind}/>
                ))
              }
            </tr>

        }
      </thead>
      {
        data.length <= 0 ? null :
        <tbody>
          {
            pagination.data.map((dt, idTr) => (
              <tr key={idTr} >
                {
                  dt.map((data, index)=> (
                    <TableRow key={'row-'+index} data={data} index={index} />
                  ))
                }
              </tr>
            ))
          }
        </tbody>
      }
      </table>

      <VeeManTablePagination pagination={pagination} handleChangePagination={handleChangePagination} />

    </div>
  )
}

export default withTranslation()(ResultTable)
