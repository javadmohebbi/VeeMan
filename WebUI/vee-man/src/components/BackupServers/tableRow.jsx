import React from 'react'
import { withTranslation } from 'react-i18next'
import { FormatIntNumbers, ExtractUID } from '../../configs/dataTypes/convert'

import {Link} from 'react-router-dom'

const BackupServerRow = (props) => {

  const { t, rows=[] } = props

  return (
    <>
      {
        rows.map((row, index) => (
          <tr key={index}>
            <th scope="row">{row.Name}</th>
            <td>{FormatIntNumbers(row.Jobs.length)}</td>
            <td>{FormatIntNumbers(row.Repositories.length)}</td>
            <td className="btn-group">
              <Link to={{
                  pathname: `/mgmt/backupservers/${ExtractUID(row.UID)}/jobs`,
                  state: {
                    title: row.Name,
                    backPath: '/mgmt/backupservers'
                  }
                }}
                className="btn btn-sm btn-light">
                <i className="fas fa-tasks mr-1"></i>
                {t('general.veeam.jobs')}
              </Link>
              <Link to={{
                  pathname: `/mgmt/backupservers/${ExtractUID(row.UID)}/repositories`,
                  state: {
                    title: row.Name,
                    backPath: '/mgmt/backupservers'
                  }
                }}
                className="btn btn-sm btn-light">
                <i className="fas fa-server mr-1"></i>
                {t('general.veeam.repositories')}
              </Link>
            </td>
          </tr>
        ))
      }
    </>
  )

}


export default withTranslation()(BackupServerRow)
