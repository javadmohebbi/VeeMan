import React from 'react'
import { withTranslation } from 'react-i18next'

import {GetJobAllBackupSessions} from '../../services/jobs'

import LightSpinner from '../Loading/Spinner/Light'

import VeeManTable from '../Table/table'
import JobBackupSessionRow from './sessionTableRow'
import Toastification from '../Toastification/toastification'

import { toast } from 'react-toastify'


import './job.css'


const JobBackupSession = (props) => {
  const {t} = props

  const uid = props.match.params.id


  const containerId = 'jobsBackupSessionListRealatedToBackupServer'

  const [list, setList] = React.useState([])
  const [busy, setBusy] = React.useState(true)


  // Initialize list
  React.useEffect(() => {
    if (typeof uid !== 'undefined') {
      GetJobAllBackupSessions(uid).then(data => {
        if (data.hasOwnProperty('error') && data.error === true) {
          // Handle Errors
          toast.error(data.message, {containerId: containerId})
        } else {
          setList(data)
        }
        setBusy(false)
      })
    }
  }, [uid])

  React.useEffect(() => { document.title = t('general.app.long') + ' | ' + t('general.nav.jobs') }, [t])

  const Thead = () => (
    <>
      <th scope="col">{t('general.inp.name')}</th>
      <th scope="col">{t('general.inp.type')}</th>
      <th scope="col">{t('general.inp.progress')}</th>
      <th scope="col">{t('general.inp.createdAt')}</th>
      <th scope="col">{t('general.inp.endedAt')}</th>
      <th scope="col">{t('general.inp.lastState')}</th>
      <th scope="col">{t('general.inp.lastResult')}</th>
      <th scope="col">{t('general.inp.operation')}</th>
    </>
  )

  const Trows = ({rows=[]}) => {
    return (
      <JobBackupSessionRow rows={rows} />
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
              {t('general.nav.jobs')}
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
        <VeeManTable list={list} listKey={'Job'} Thead={Thead} Trows={Trows} notAvailableCols={8} />
      </div>
    </div>

    </>

  )
}


export default withTranslation()(JobBackupSession)
