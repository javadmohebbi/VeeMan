import React from 'react'
import { withTranslation } from 'react-i18next'
import {PrepareResult, ConvertQueryResultToResult} from '../../services/rawQuery/preparation'

import ResultTable from './resultTable'


const QueryResult = (props) => {
  const { t } = props
  const { queryResult=null, queryType, wantedType=[], showCol=[], UpdateMetaData } = props

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



  // Update Meta Data
  const handleUpdateResultMetaData = (newShowCol, newWantedType) => {
    UpdateMetaData(newShowCol, newWantedType);
  }

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
                        <ResultTable result={preparedResults}
                          UpdateMetaData = {handleUpdateResultMetaData}
                          wantedType={ wantedType || [] } showCol={ showCol || [] }/>
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
