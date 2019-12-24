import React from 'react'
import { withTranslation } from 'react-i18next'
import {PrepareResult, ConvertQueryResultToResult} from '../../services/rawQuery/preparation'

const QueryResult = (props) => {
  const { t } = props
  const { queryResult=null, queryType } = props

  const [title, setTitle] = React.useState('')
  const [pluralTitle, setPluralTitle] = React.useState(null)
  const [result, setResult] = React.useState(null)


  React.useEffect(() => {
    const upperFirstQueryType = queryType.charAt(0).toUpperCase() + queryType.substring(1);
    setTitle(upperFirstQueryType)
    setPluralTitle(null)
    setResult(null)
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
      PrepareResult(result, title, pluralTitle)
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

  return (
    <>
      {
        queryResult === null ? null :
        <div className="card text-white bg-dark mb-3">
          <div className="card-body">
            <h5 className="card-title">{t('general.veeam.queryResult')}</h5>
            <div className="card-text">
              <p>{pluralTitle !== null ? pluralTitle : title }</p>
              {
                queryResult === null && result !== null ? null :
                <>
                {
                  (typeof result === 'object' && result !== null) ?
                    <div>
                      result set
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
