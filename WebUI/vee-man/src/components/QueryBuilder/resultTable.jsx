import React from 'react'
import { withTranslation } from 'react-i18next'
import {
  FormatString, FormatPercentage, FormatSeconds,
  FormatNanoSeconds, FormatMiliSeconds, FormatFloatNumbers,
  FormatIntNumbers, FormatBytes, ExtractUID
} from '../../configs/dataTypes/convert'

import _ from 'lodash'

import './resultTable.css'

const FormatDateStr = (str) => {
  let d = new Date(str)
  let fd = FormatString(d.toLocaleString())
  if (fd === 'Invalid Date') return 'N.A'
  return fd
}

const ResultTable = (props) => {
  const {result} = props

  const [headers, setHeaders] = React.useState([])
  const [dataTypes, setDataTypes] = React.useState([])
  const [data, setData] = React.useState([])

  const [wantedType, setWantedType] = React.useState([])



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

      if (result.hasOwnProperty('wantedType')) {
        setWantedType(result.wantedType)
      } else {
        if (result.hasOwnProperty('dataType')) {
          setWantedType(result.dataType)
        } else {
          setWantedType([])
        }
      }

      if (result.hasOwnProperty('data')) {
        setData(result.data)
      }
    }
  }, [result])

  React.useEffect(() => {
    console.log(wantedType);
  }, [wantedType])



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
    setWantedType(wt)
  }


  return (
    <div className="rt-holder">
      <table className="table table-dark table-striped table-hover">
      {
        headers.length <= 0 ? null :
        <thead>
          <tr>
            {
              headers.map((ttl, ind) => (
                <th scope="col" key={ind} title={ttl} style={{whiteSpace: 'nowrap',overflow: 'hidden', textOverflow: 'ellipsis'  }}>
                  {ttl}
                </th>
              ))
            }
          </tr>
        </thead>
      }
      {
        dataTypes.length <= 0 ? null :
        <thead>
          <tr>
            {
              wantedType.map((dtp, ind) => (
                <th scope="col" key={ind} title={dtp} style={{whiteSpace: 'nowrap',overflow: 'hidden', textOverflow: 'ellipsis', verticalAlign: 'top'  }}>
                  {/* t('general.inp.dataType') + ': ' + dtp */}
                  {
                    dtp === "object" ? <>{dtp}</> :
                    <>
                      <div>
                        <select style={{maxWidth: '100%'}} id={`convert-${ind}`} value={dtp} onChange={e => {e.preventDefault(); handleChangeConvertedType(e.target.value, ind)}}>
                          {
                            ConvertedTypes.map((item, j) => (
                              <option key={j} value={item.value}>{item.name}</option>
                            ))
                          }
                        </select>
                      </div>
                    </>
                  }
                </th>
              ))
            }
          </tr>
        </thead>
      }
      {
        data.length <= 0 ? null :
        <tbody>
          {
            data.map((dt, idTr) => (
              <tr key={idTr} >
                {
                  dt.map((data, index)=> (
                    <td key={index} title={ convertTo( wantedType[index] , data) }
                      style={{whiteSpace: 'nowrap',overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {/* typeof data === 'string' ? data : '[object]' */}
                      {

                        convertTo( wantedType[index] , data)
                      }
                    </td>
                  ))
                }
              </tr>
            ))
          }
        </tbody>
      }
      </table>
    </div>
  )
}

export default withTranslation()(ResultTable)
