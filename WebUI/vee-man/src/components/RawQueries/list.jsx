import React from 'react'
import { withTranslation } from 'react-i18next'

import { GetAllQueryFromServer } from '../../services/rawQuery/get'

const QueriesList = (props) => {

  const [queryList, setQueryList] = React.useState([])
  const [busy, setBusy] = React.useState(false)

  React.useEffect(() => {
    GetAllQueryFromServer().then(data => {
      setBusy(true)
      if (data.hasOwnProperty('error') && data.error === true) {
        //toast
        console.log(data.message);
      } else {
        setQueryList(data)
      }
      setBusy(false)
    })
  }, [])

  return (
    <div>
      Queries List {busy ? 'busy' : QueriesList.length}
    </div>
  )
}


export default withTranslation()(QueriesList)
