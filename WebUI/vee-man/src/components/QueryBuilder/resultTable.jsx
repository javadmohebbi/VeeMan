import React from 'react'
import { withTranslation } from 'react-i18next'

import './resultTable.css'

const ResultTable = (props) => {

  const {result} = props

  const [headers, setHeaders] = React.useState([])
  const [dataTypes, setDataTypes] = React.useState([])
  const [data, setData] = React.useState([])

  React.useEffect(() => {
    if (result !== null ) {
      if (result.hasOwnProperty('titles')) {
        setHeaders(result.titles)
      }
      if (result.hasOwnProperty('dataType')) {
        setDataTypes(result.dataType)
      }
      if (result.hasOwnProperty('data')) {
        setData(result.data)
      }
    }
  }, [result])

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
              dataTypes.map((dtp, ind) => (
                <th scope="col" key={ind} title={dtp} style={{whiteSpace: 'nowrap',overflow: 'hidden', textOverflow: 'ellipsis'  }}>
                  {dtp}
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
                    <td key={index} title={ typeof data === 'string' ? data : '[object]' }
                      style={{whiteSpace: 'nowrap',overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      { typeof data === 'string' ? data : '[object]' }
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
