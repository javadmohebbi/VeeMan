import React from 'react'
import { withTranslation } from 'react-i18next'
import { FormatString, ExtractUID } from '../../configs/dataTypes/convert'
import {Link} from 'react-router-dom'
import JobLastStateBadge from './jobLastStateBadge'
import JobLastResultBadge from './jobLastResultBadge'

import { useLocation } from 'react-router'

const JobListRow = (props) => {

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
            <th scope="row">{row.Job.Name}</th>
            <td>{row.Job.JobType}</td>
            <td>{row.Job.Platform}</td>
            <td>{formatDateStr(row.Job.NextRun)}</td>
            <td>{row.Job.Description}</td>
            <td><JobLastStateBadge id={ExtractUID(row.Job.UID)} /></td>
            <td><JobLastResultBadge id={ExtractUID(row.Job.UID)} /></td>
            <td className="btn-group">
              <Link to={{
                  pathname: `/mgmt/jobs/${ExtractUID(row.Job.UID)}/info`,
                  state: {
                    title: row.Job.Name,
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


export default withTranslation()(JobListRow)
