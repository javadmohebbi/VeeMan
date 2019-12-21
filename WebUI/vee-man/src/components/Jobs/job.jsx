import React from 'react'
import { withTranslation } from 'react-i18next'

import {GetJobsRelatedToBackupServerListFromServer} from '../../services/jobs'

import LightSpinner from '../Loading/Spinner/Light'

import VeeManTable from '../Table/table'
import JobListRow from './tableRow'
import Toastification from '../Toastification/toastification'

import { toast } from 'react-toastify'


import './job.css'


const JobsList = (props) => {
  const {t} = props

  const uid = props.match.params.id


  const containerId = 'jobsListRealatedToBackupServer'

  const [list, setList] = React.useState([])
  const [busy, setBusy] = React.useState(true)


  // Initialize list
  React.useEffect(() => {
    if (typeof uid !== 'undefined') {
      GetJobsRelatedToBackupServerListFromServer(uid).then(data => {
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
      <th scope="col">{t('general.inp.platform')}</th>
      <th scope="col">{t('general.inp.nextRun')}</th>
      <th scope="col">{t('general.inp.desc')}</th>
      <th scope="col">{t('general.inp.lastState')}</th>
      <th scope="col">{t('general.inp.lastResult')}</th>
      <th scope="col">{t('general.inp.operation')}</th>
    </>
  )

  const Trows = ({rows=[]}) => {
    return (
      <JobListRow rows={rows} />
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


export default withTranslation()(JobsList)
