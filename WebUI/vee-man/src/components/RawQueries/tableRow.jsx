import React from 'react'
import { withTranslation } from 'react-i18next'
import LightSpinner from '../Loading/Spinner/Light'

import {Link} from 'react-router-dom'

const QueryListRow = (props) => {

  const { t, rows=[], RemoveFromList } = props

  const [busy, setBusy] = React.useState(false)

  const getLastCountId = (qs) => {
    var cId = 1
    for (var i=0; i < qs.length; i++) {
      if (cId < qs[i].countId) {
        cId = qs[i].countId
      }
    }
    return cId++
  }


  const handleDelete = (uId, index) => {

    setBusy(true)
    RemoveFromList(uId, index)
    setBusy(false)

  }


  return (
    <>
      {
        rows.map((row, index) => (
          <tr key={index}>
            <th scope="row">{row.metadata.title}</th>
            <td className="btn-group">
              {
                !busy ?
                <>
                  <Link to={{
                      pathname: `/mgmt/query/${row.uid}`,
                      state: {
                        queriesParam: row.queries,
                        metadataParam: row.metadata,
                        titleParam: row.metadata.title,
                        uidParam: row.uid,
                        cIdParam: getLastCountId(row.queries),
                        typeParam: row.metadata.type,
                        runItParam: true,
                        justViewParam: false,
                      }
                    }}
                    className="btn btn-sm btn-warning">
                    <i className="fas fa-pen mr-1"></i>
                    {t('general.btn.edit')}
                  </Link>
                  <Link to={{
                      pathname: `/mgmt/query/${row.uid}`,
                      state: {
                        queriesParam: row.queries,
                        metadataParam: row.metadata,
                        titleParam: row.metadata.title,
                        uidParam: row.uid,
                        cIdParam: getLastCountId(row.queries),
                        typeParam: row.metadata.type,
                        runItParam: true,
                        justViewParam: true,
                      }
                    }}
                    className="btn btn-sm btn-light">
                    <i className="fas fa-eye mr-1"></i>
                    {t('general.btn.view')}
                  </Link>
                  <button className="btn btn-sm btn-danger" onClick={e => {e.preventDefault(); handleDelete(row.uid, index)}}>
                    <i className="fas fa-trash mr-1"></i>
                    {t('general.btn.delete')}
                  </button>
                </>
                :
                <LightSpinner spinnerSize="sm" />
              }

            </td>
          </tr>
        ))
      }
    </>
  )

}


export default withTranslation()(QueryListRow)
