import React from 'react'
import { withTranslation } from 'react-i18next'

import { GetQueryTypes } from '../../configs/queryBuilder/queryTypes'

import Toastification from '../Toastification/toastification'
import { toast } from 'react-toastify'

import './query.css'

const QueryBuilder = (props) => {

  const containerId = 'queryBuilder'
  const [selectedType, setSelectedType] = React.useState('')
  const { t } = props


  React.useEffect(() => {
    console.log(selectedType);
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
                <select className="form-control mx-2" value={selectedType} onChange={handleSelectTypeChange}>
                  {
                    GetQueryTypes().map((item, index) => {
                      return (
                        <option key={index} value={item.queryType}>{item.queryType}</option>
                      )
                    })
                  }
                </select>
              </div>
            </div>
          </div>

          {/* REST BODY */}
          <div className="pg-rest mt-2 mb-2">
            Query Builder
          </div>
        </div>
      </div>

    </>
  )
}


export default withTranslation()(QueryBuilder)
