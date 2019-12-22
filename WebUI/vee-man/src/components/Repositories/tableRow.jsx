import React from 'react'
import { withTranslation } from 'react-i18next'
import { FormatBytes } from '../../configs/dataTypes/convert'

const RepoListRow = (props) => {

  const { rows=[] } = props

  return (
    <>
      {
        rows.map((row, index) => (
          <tr key={index}>
            <th scope="row">{row.Repository.Name}</th>
            <td>{row.Repository.Type}</td>
            <td>{row.Repository.Kind}</td>
            <td>{FormatBytes(row.Repository.Capacity)}</td>
            <td>{FormatBytes(row.Repository.FreeSpace)}</td>
          </tr>
        ))
      }
    </>
  )

}


export default withTranslation()(RepoListRow)
