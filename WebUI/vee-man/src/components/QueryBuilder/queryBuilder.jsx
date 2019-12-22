import React from 'react'
import { withTranslation } from 'react-i18next'

import { GetQueryTypes } from '../../configs/queryBuilder/queryTypes'

import Toastification from '../Toastification/toastification'
import { toast } from 'react-toastify'

import './query.css'

const QueryBuilder = (props) => {

  const { t } = props

  const containerId = 'queryBuilder'
  const [selectedType, setSelectedType] = React.useState(t('general.msg.nothingSelected'))


  React.useEffect(() => {
    // console.log(selectedType);
  }, [selectedType])

  const handleSelectTypeChange = (e) => {
    e.preventDefault()
    setSelectedType(e.target.value)
  }

  return (
    <>
      <Toastification containerId={containerId} />
      <div className="container-fluid pg-wrapper">
        {/* PAGE TITLE */}
        <div className="row">
          <div className="col-12">
              <h1 className="page-title pb-2">
                {t('general.nav.query')}
                {/*
                  busy ?
                  <LightSpinner spinnerSize="sm" />
                  :
                  null
                */}
              </h1>
          </div>
        </div>

        {/* BODY */}
        <div className="pg-body">
          {/* SUB HEADER */}
          <div className="pg-sb-header mt-2 mb-2">
            {/* Header content */}
            <div className="pg-qry">
              <div className="pg-qry-builder">

                {/* Option Query Type */}
                <div className="col-sm-12 col-md-3">
                  <label htmlFor="querytype" className="col-12 col-form-label">Query Type</label>
                  <div className="col-12">
                    <select id="querytype" className="form-control" value={selectedType} onChange={handleSelectTypeChange}>
                      <option key={'nothingselected'} value={t('general.msg.nothingSelected')}>{t('general.msg.nothingSelected')}</option>
                      {
                        GetQueryTypes().map((item, index) => {
                          return (
                            <option key={index} value={item.cameleCase}>{item.queryType}</option>
                          )
                        })
                      }
                    </select>
                  </div>
                </div>                


              </div>
            </div>
          </div>

          {/* REST BODY */}
          <div className="pg-rest mt-2 mb-2">
            Body
          </div>
        </div>
      </div>

    </>
  )
}


export default withTranslation()(QueryBuilder)
