import React from 'react'
import { withTranslation } from 'react-i18next'

import { GetJobBackupSession } from '../../services/jobs'
import LightSpinner from '../Loading/Spinner/Light'


const JobLastStateBadge = ({id}) => {

  const [busy, setBusy] = React.useState(true)

  const [jobState,setJobstate] = React.useState('N.A')

  React.useEffect(() => {
    setBusy(true)
    GetJobBackupSession(id).then(data => {
      if (data.hasOwnProperty('error') && data.error === true) {
        setJobstate('N.A')
      } else {
        setJobstate(data.BackupJobSession.State)
      }
      setBusy(false)
    })
  }, [id])


  const Badge = ({txt}) => {
    var label = 'secondary'
    switch (txt) {
      case 'Starting':
        label = 'success'
        break
      case 'Stopping':
        label = 'danger'
        break
      case 'Working':
        label = 'info'
        break
      case 'Pausing':
        label = 'warning'
        break
      case 'Resuming':
        label = 'warning'
        break
      case 'Stopped':
        label = 'secondary'
        break
      default:
        label = 'secondary'
    }

    return (
      <span className={`badge badge-${label}`}>{txt}</span>
    )

  }

  return (
    <>
    {
      busy ?
      <div><LightSpinner spinnerSize="sm" /></div>
      :
      <>
      {
        <Badge txt={jobState}/>
      }
      </>
    }
    </>
  )

}


export default withTranslation()(JobLastStateBadge)
