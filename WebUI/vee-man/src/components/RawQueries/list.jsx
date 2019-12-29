import React from 'react'
import { withTranslation } from 'react-i18next'

import { GetAllQueryFromServer } from '../../services/rawQuery/get'
import LightSpinner from '../Loading/Spinner/Light'
import QueryListRow from './tableRow'
import VeeManTable from '../Table/table'
import {DeleteQueryFromServer} from '../../services/rawQuery/delete'

import Toastification from '../Toastification/toastification'
import { toast } from 'react-toastify'


import './list.css'

const QueriesList = (props) => {

  const {t} = props

  const containerId = 'listQueries'

  const [queryList, setQueryList] = React.useState([])
  const [nodata, setNodata] = React.useState(true)

  const [busy, setBusy] = React.useState(false)

  React.useEffect(() => {
    if (queryList !== null && queryList.length === 0) {
      setBusy(true)
      GetAllQueryFromServer().then(data => {
        if (data !== null && data.hasOwnProperty('error') && data.error === true) {
          toast.error(data.message, {containerId: containerId})
          setNodata(true)
        } else {
          if (data === null ) {
            setNodata(true)
          } else {
            setNodata(false)
          }
          setQueryList(data)
        }
        setBusy(false)
      })
    }
  }, [queryList])

  const handleRemoveFromList = (uId, index) => {
    DeleteQueryFromServer(uId).then(data => {
      setBusy(true)
      if (data.hasOwnProperty('error') && data.error !== false) {
        alert(data.message)
      } else {
        // var arr = queryList
        // arr.splice(index, 1)
        setQueryList([])
      }
      setBusy(false)
    })
  }

  const Thead = () => (
    <>
      <th scope="col">{t('general.inp.name')}</th>
      <th scope="col">{t('general.inp.operation')}</th>
    </>
  )

  const Trows = ({rows=[]}) => {
    return (
      <QueryListRow RemoveFromList={handleRemoveFromList} rows={rows} />
    )
  }

  return (
    <>
      <Toastification containerId={containerId} />
      <div className="container-fluid pg-wrapper">
        {/* PAGE TITLE */}
        <div className="row">
          <div className="col-12">
              <h1 className="page-title pb-2">
                {t('general.nav.queries')}
                {
                  busy ?
                  <LightSpinner spinnerSize="sm" />
                  :
                  null
                }
              </h1>
          </div>
        </div>
      </div>


      {/* BODY */}
      <div className="pg-body">
        {/* SUB HEADER */}
        <div className="pg-sb-header mt-2 mb-2">
          {/* Header content */}
        </div>

        {/* REST BODY */}
        <div className="pg-rest mt-2 mb-2">
          {
            queryList !== null ? null :
            <>
            {
              nodata === false ? <VeeManTable list={queryList} listKey={'metadata'} Thead={Thead} Trows={Trows} />
              :
              <span className="mx-3" >{'N/A'}</span>
            }
            </>
          }
        </div>
      </div>
    </>
  )
}


export default withTranslation()(QueriesList)
