import React from 'react'
import { withTranslation } from 'react-i18next'
import {PrepareResult, ConvertQueryResultToResult} from '../../services/rawQuery/preparation'

import ResultTable from './resultTable'


const QueryResult = (props) => {
  const { t } = props
  const { queryResult=null, queryType } = props

  const [title, setTitle] = React.useState('')
  const [pluralTitle, setPluralTitle] = React.useState(null)
  const [result, setResult] = React.useState(null)

  const [preparedResults, setPreparedResults] = React.useState(null)


  React.useEffect(() => {
    const upperFirstQueryType = queryType.charAt(0).toUpperCase() + queryType.substring(1);
    setTitle(upperFirstQueryType)
    setPluralTitle(null)
    setResult(null)
    // setPreparedResults(null)
  }, [queryType])

  React.useEffect(()=> {
    if (title !== '' && pluralTitle === null) {
      var arr = ConvertQueryResultToResult(queryResult, title)
      if (arr.pluralTitle !== null) { setPluralTitle(arr.pluralTitle) }
      if (arr.title !== null) { setTitle(arr.title) }
      if (arr.result !== null) { setResult(arr.result) }
    }
  }, [queryResult, title, pluralTitle])


  React.useEffect(() => {
    if (typeof result === 'object' && result !== null) {
      // console.log(typeof result, '(', result,')');
      setPreparedResults(PrepareResult(result, title, pluralTitle))
    }
  }, [result, title, pluralTitle])

  // React.useEffect(() => {
  //   if (title !== '' && queryResult !== null && result === null) {
  //     var tmpTitle = Pluralize(title)
  //     if (queryResult.hasOwnProperty(title)) {
  //       setResult(queryResult[title])
  //       setPluralTitle(null)
  //     } else if (queryResult.hasOwnProperty(tmpTitle)) {
  //       setResult(queryResult[tmpTitle])
  //       setPluralTitle(tmpTitle)
  //     } else {
  //       setResult(null)
  //       setPluralTitle(null)
  //     }
  //   }
  // }, [title, queryResult, result])

  // const HandlePrepare = () => {
  //   var rs = PrepareResult(result,title, pluralTitle)
  //   return (
  //     <div>
  //       RS {rs.refType}
  //     </div>
  //   )
  // }

  // const Rows = ({d}) => {
  //   // for (var k=0; k < d.length; k++) {
  //   //   <span key={k} className="mr-5 d-inline-block" title={typeof d[k] === 'object' ? <>[object]</> : <>{d[k]}</>} style={{width: '70px',maxWidth: '70px', whiteSpace: 'nowrap',overflow: 'hidden', textOverflow: 'ellipsis' }}>
  //   //     { typeof data === 'object' ? <>[object]</> : <>{d[k]}</> }
  //   //   </span>
  //   // }
  //   // const Col = ({row}) => {
  //   //   return _.map(row, (d, index) => {
  //   //     return (
  //   //       <span key={index} className="mr-5 d-inline-block" title={typeof d === 'object' ? <>[object]</> : <>{d}</>} style={{width: '70px',maxWidth: '70px', whiteSpace: 'nowrap',overflow: 'hidden', textOverflow: 'ellipsis' }}>
  //   //         { typeof d === 'object' ? <>[object]</> : <>{d}</> }
  //   //       </span>
  //   //     )
  //   //   })
  //   // }
  //
  //   // console.log(d);
  //   return d.map((data, index)=> {
  //     return (
  //         <span key={index} className="mr-5 d-inline-block"
  //           title={ typeof data === 'string' ? data : '[object]' }
  //           style={{width: '70px',maxWidth: '70px', whiteSpace: 'nowrap',overflow: 'hidden', textOverflow: 'ellipsis' }}>
  //           { typeof data === 'string' ? data : '[object]' }
  //         </span>
  //
  //     )
  //   })
  // }

  return (
    <>
      {
        queryResult === null ? null :
        <div className="card text-white bg-dark mb-3">
          <div className="card-body">
            <h5 className="card-title">{t('general.veeam.queryResult')} (<span className='text-warning'>{pluralTitle !== null ? pluralTitle : title }</span>)</h5>
            <div className="card-text">
              {
                queryResult === null && result !== null ? null :
                <>
                {
                  (typeof result === 'object' && result !== null) ?
                    <div>
                      <div className="mt-5 p-2">
                        <ResultTable result={preparedResults} />
                      </div>
                    </div>
                  :
                  <div>
                    N/A
                  </div>
                }
                </>
              }
            </div>
          </div>
        </div>
      }
    </>
  )
}

export default withTranslation()(QueryResult)
