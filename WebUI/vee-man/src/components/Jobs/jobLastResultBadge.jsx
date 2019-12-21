import React from 'react'
import { withTranslation } from 'react-i18next'

import { GetJobBackupSession } from '../../services/jobs'
import LightSpinner from '../Loading/Spinner/Light'


const JobLastResultBadge = ({id}) => {

  const [busy, setBusy] = React.useState(true)

  const [jobState,setJobstate] = React.useState('N.A')

  React.useEffect(() => {
    setBusy(true)
    GetJobBackupSession(id).then(data => {
      if (data.hasOwnProperty('error') && data.error === true) {
        setJobstate('N.A')
      } else {
        setJobstate(data.BackupJobSession.Result)
      }
      setBusy(false)
    })
  }, [id])


  const Badge = ({txt}) => {
    var label = 'secondary'
    switch (txt) {
      case 'Success':
        label = 'success'
        break
      case 'Warning':
        label = 'warning'
        break
      case 'Failed':
        label = 'danger'
        break
      default:
        label = 'default'
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


export default withTranslation()(JobLastResultBadge)
