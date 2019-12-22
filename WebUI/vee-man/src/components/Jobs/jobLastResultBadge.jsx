import React from 'react'
import { withTranslation } from 'react-i18next'

import { GetJobBackupSession } from '../../services/jobs'
import LightSpinner from '../Loading/Spinner/Light'


const JobLastResultBadge = ({id, dontFetch=false, txtBadge='N.A'}) => {

  const [busy, setBusy] = React.useState(!dontFetch)

  const [jobState,setJobstate] = React.useState(txtBadge)  

  React.useEffect(() => {
    if (!dontFetch) {
      setBusy(true)
      GetJobBackupSession(id).then(data => {
        if (data.hasOwnProperty('error') && data.error === true) {
          setJobstate('N.A')
        } else {
          setJobstate(data.BackupJobSession.Result)
        }
        setBusy(false)
      })
    } else {
       setJobstate(txtBadge)
    }
  }, [id,dontFetch, txtBadge])


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


export default withTranslation()(JobLastResultBadge)
