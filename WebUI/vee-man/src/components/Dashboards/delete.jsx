import React from 'react'
import { withTranslation } from 'react-i18next'
import './delete.css'

import LightSpinner from '../Loading/Spinner/Light';
import { getADashboard } from '../../services/dashboards'

import { deleteADashboard } from '../../services/dashboards'

import { useHistory } from 'react-router'

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';



const deletePhrase = 'I DONT CARE'


const DeleteDashboard = (props) => {
  const {t} = props

  const id = props.match.params.id

  const h = useHistory()



  const [isError, setIsError] = React.useState(false)
  const [dashboard, setDashboards] = React.useState({Name: '...'})
  const [phrase, setPhrase] = React.useState('')
  const [busy, setBusy] = React.useState(true)
  const [showDeleteButton, setShowDeleteButton] = React.useState(false)

  const [deletedSucess, setDeletedSuccess] = React.useState(false)

  React.useEffect(() => {
    getADashboard(id).then(data => {
      if (data.hasOwnProperty('error') && data.error === true) {
        setIsError(true)
        setShowDeleteButton(false)
      } else {
        setIsError(false)
        document.title = t('general.app.long') + ' | ' + t('general.btn.delete')
          + ' | ' + data.dashboard.Name
        setDashboards(data.dashboard)
      }
      setBusy(false)
    })
  }, [id, t])



  const handleTxtPhraseChange = (e) => {
    if (e.target.value.toLowerCase()  === deletePhrase.toLowerCase() ) { setShowDeleteButton(true) } else { setShowDeleteButton(false) }
    setPhrase(e.target.value)
  }

  const handleDeleteDashboard = () => {
    deleteADashboard(id).then(data => {
      if (data.hasOwnProperty('error') && data.error === true) {
        setBusy(true)
        toast.error(data.message, {containerId: 'deleteDashboard'})
      } else {
        toast.success(t('titles.dashboard') + ' ' + t('general.msg.dataDeleted'), {containerId: 'deleteDashboard'})
        setBusy(false)
        setDeletedSuccess(true)
        let timer = setTimeout(() => {
          h.push('/dashboards')
          clearTimeout(timer)
        }, 3000)
      }
    })
  }

  return (
    <div className="container-fluid">
      <ToastContainer enableMultiContainer containerId={'deleteDashboard'} position={toast.POSITION.BOTTOM_RIGHT} />

      <div className="row">
        <div className="col-12">
          <div className="deleteForm text-center">
            <div className="deleteForm-wrapper">
              <div className="title">
                <h5 className="page-title pb-3">
                  <span className="mr-2">{t('titles.delete')}:</span>
                  <span className="text-warning">{ !isError ? dashboard.Name : '...'}</span>
                </h5>
              </div>
              <div className="content">
                <p>{t('general.info.deleteDashboard')}</p>
                { !deletedSucess ?
                  <>
                  <p className="text-warning">{deletePhrase}</p>
                  <div className="col-sm-8 offset-sm-2 col-md-6 offset-md-3 col-lg-4 offset-lg-4">
                    <label htmlFor="inputConfirm" className="sr-only">{deletePhrase}</label>
                    <input type="text" id="inputConfirm" value={phrase} onChange={handleTxtPhraseChange} className="form-control" placeholder={''} required=""/>
                  </div>
                  </>
                  :
                  null
                }

                {
                  showDeleteButton && !deletedSucess ?
                  <button className="btn btn-danger mt-4"
                    onClick={handleDeleteDashboard}
                  >
                    <i className="fas fa-trash"></i>
                    Delete {!isError ? dashboard.Name : null}
                    {
                      busy ? <LightSpinner spinnerSize="sm" /> : null
                    }
                  </button>
                  :
                  null
                }

              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  )
}



export default withTranslation()(DeleteDashboard)
