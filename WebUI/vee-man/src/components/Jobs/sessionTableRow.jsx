import React from 'react'
import { withTranslation } from 'react-i18next'
import { FormatString, ExtractUID } from '../../configs/dataTypes/convert'
import {Link} from 'react-router-dom'
import JobLastStateBadge from './jobLastStateBadge'
import JobLastResultBadge from './jobLastResultBadge'

import {useLocation} from 'react-router'

const JobBackupSessionRow = (props) => {

  const { t, rows=[] } = props

  const {pathname=null} = useLocation()

  const formatDateStr = (str) => {
    let d = new Date(str)
    let fd = FormatString(d.toLocaleString())
    if (fd === 'Invalid Date') return 'N.A'
    return fd
  }


  return (
    <>
      {
        rows.map((row, index) => (
          <tr key={index}>
            <th scope="row">{row.JobName}</th>
            <td>{row.JobType}</td>
            <td className="text-bold">{row.Progress < 100 ? <span className="text-danger">{row.Progress}</span> : <span className="text-success">{row.Progress}</span> }</td>
            <td>{formatDateStr(row.CreationTimeUTC)}</td>
            <td>{formatDateStr(row.EndTimeUTC)}</td>
            <td><JobLastStateBadge id={ExtractUID(row.UID)} dontFetch={true} txtBadge={row.State} /></td>
            <td><JobLastResultBadge id={ExtractUID(row.UID)} dontFetch={true} txtBadge={row.Result} /></td>
            <td className="btn-group">
              <Link to={{
                  pathname: `/mgmt/job/${ExtractUID(row.UID)}/info`,
                  state: {
                    title: row.JobName,
                    backPath: pathname
                  }
                }}
                className="btn btn-sm btn-light">
                <i className="fas fa-info mr-1"></i>
                {t('general.btn.info')}
              </Link>
            </td>
          </tr>
        ))
      }
    </>
  )

}


export default withTranslation()(JobBackupSessionRow)
