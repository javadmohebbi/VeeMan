import React from 'react'
import { withTranslation } from 'react-i18next'
import { FormatBytes } from '../../configs/dataTypes/convert'

const RepoListRow = (props) => {

  const { rows=[] } = props

  const Percentage = ({cap=0.0, fre=0.0}) => {
    var perc = (fre * 100 / cap).toFixed(2)
    var label = "secondary"

    if (perc <= 10) {
      label = "danger"
    } else if (perc > 10 && perc <= 40) {
      label = "warning"
    } else if (perc > 40 && perc <= 70) {
      label = "info"
    } else {
      label = "success"
    }

    return (
      <span className={`badge badge-xl badge-${label} mr-2 ml-2`}>
        %
        {
          perc
        }
      </span>
    )
  }


  return (
    <>
      {
        rows.map((row, index) => (
          <tr key={index}>
            <th scope="row">{row.Repository.Name}</th>
            <td>{row.Repository.Type}</td>
            <td>{row.Repository.Kind}</td>
            <td>{FormatBytes(row.Repository.Capacity)}</td>
            <td>
              {FormatBytes(row.Repository.FreeSpace)}
              <Percentage cap={parseFloat(row.Repository.Capacity)} fre={parseFloat(row.Repository.FreeSpace)} />
            </td>
          </tr>
        ))
      }
    </>
  )

}


export default withTranslation()(RepoListRow)
