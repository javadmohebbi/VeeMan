import React from 'react'
import { withTranslation } from 'react-i18next'

import {GetBackupServerListFromServer} from '../../services/backupServers'

import LightSpinner from '../Loading/Spinner/Light'

import VeeManTable from '../Table/table'
import BackupServerRow from './tableRow'
import Toastification from '../Toastification/toastification'

import { toast } from 'react-toastify'


import './list.css'


// const dummyData = [
//   { Name: 'aaa', Jobs: [], Repositories: [] },
//   { Name: 'aaa', Jobs: [], Repositories: [] },
//   { Name: 'aaa', Jobs: [], Repositories: [] },
//   { Name: '22', Jobs: [], Repositories: [] },
//   { Name: 'aaa', Jobs: [], Repositories: [] },
//   { Name: 'aaa', Jobs: [], Repositories: [] },
//   { Name: 'aaa', Jobs: [], Repositories: [] },
//   { Name: 'aaa', Jobs: [], Repositories: [] },
//   { Name: 'ee', Jobs: [], Repositories: [] },
//   { Name: 'aaa', Jobs: [], Repositories: [] },
//   { Name: 'ss', Jobs: [], Repositories: [] },
//   { Name: 'aaa', Jobs: [], Repositories: [] },
//   { Name: 'aaa', Jobs: [], Repositories: [] },
//   { Name: 'ww', Jobs: [], Repositories: [] },
//   { Name: 'aaa', Jobs: [], Repositories: [] },
//   { Name: 'w', Jobs: [], Repositories: [] },
//   { Name: 'aaa', Jobs: [], Repositories: [] },
// ]




const BackupServerList = (props) => {
  const {t} = props

  const containerId = 'bkupServer'

  const [list, setList] = React.useState([])
  const [busy, setBusy] = React.useState(true)


  // Initialize list
  React.useEffect(() => {
    GetBackupServerListFromServer().then(data => {
      if (data.hasOwnProperty('error') && data.error === true) {
        // Handle Errors
        toast.error(data.message, {containerId: containerId})
      } else {
        setList(data)
      }
      setBusy(false)
    })
  }, [])

  React.useEffect(() => { document.title = t('general.app.long') + ' | ' + t('general.nav.backupservers') }, [t])

  const Thead = () => (
    <>
      <th scope="col">{t('general.inp.name')}</th>
      <th scope="col">{t('general.veeam.jobs')}</th>
      <th scope="col">{t('general.veeam.repositories')}</th>
      <th scope="col">{t('general.inp.operation')}</th>
    </>
  )

  const Trows = ({rows=[]}) => {
    return (
      <BackupServerRow rows={rows} />
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
              {t('general.nav.backupservers')}
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
        <VeeManTable list={list} Thead={Thead} Trows={Trows} />
      </div>
    </div>

    </>

  )
}


export default withTranslation()(BackupServerList)
