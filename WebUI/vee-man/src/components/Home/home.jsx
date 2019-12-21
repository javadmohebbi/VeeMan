import React from 'react'
import {withTranslation} from 'react-i18next'
import './home.css'
import { getUsersDashboards } from '../../services/dashboards';
import { Link } from 'react-router-dom'
import LightSpinner from '../Loading/Spinner/Light';

// const dashboards = {}

const Home = (props) => {

    // const [busy, useBusy] = React.useState(true)
    const [dashboards, setDashboards] = React.useState([])
    const [busy, setBusy] = React.useState(true)

    const {t} = props

    React.useEffect(()=> {
      document.title = t('general.app.long') + ' | ' + t('general.nav.home')
    }, [t])

    React.useEffect(() => {
        getUsersDashboards().then(data => {
            if (data !== null && !data.hasOwnProperty('error')){
                setDashboards(data)
            } else {
              setDashboards([])
            }

            setBusy(false)
        })
    }, [])


    return (
        <div className="container-fluid mb-4">
            <div className="row mt-2 dashboard-list">
                <div className="btn-group d-block mr-3" style={{float: 'right', position:'absolute', right: '0', zIndex: '2'}} role="group" aria-label="Dashboard Settings">
                    <Link className="btn btn-warning" to="/dashboard/create">
                        <i className="fas fa-tachometer-alt pr-2"></i>
                        {t('general.btn.createDashboard')}
                    </Link>
                </div>
                <div className="col-sm-12 text-left">
                    <div className="paper mb-4">
                        <h1 className="page-title pb-2">
                            {t('titles.dashboards')} { busy ? <LightSpinner spinnerSize="sm" /> : '' }
                        </h1>
                    </div>
                </div>

                {
                    dashboards.length > 0 ?
                    dashboards.map((d, i) => (
                        <div key={i} className="col-sm-12 col-md-6 col-lg-4 mb-4 pb-1">
                            <div className="card">
                                <div className="card-body">
                                    <h5 className="card-title">
                                        {d.Name}
                                    </h5>
                                    <p className="card-text">
                                        {d.Description}
                                    </p>
                                    <div className="btn-group btn-group-sm" role="group" aria-label="Dashboard Settings">
                                        <Link to={`/dashboard/edit/${d.Id}`} className="btn btn-warning">
                                            <i className="fas fa-pen pr-2"></i>
                                            {t('general.btn.edit')}
                                        </Link>
                                        <Link to={`/dashboard/view/${d.Id}`} className="btn btn-secondary">
                                            <i className="fas fa-eye pr-2"></i>
                                            {t('general.btn.view')}
                                        </Link>
                                        <Link to={`/dashboard/delete/${d.Id}`} className="btn btn-danger">
                                            <i className="fas fa-trash pr-2"></i>
                                            {t('general.btn.delete')}
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                    :
                    <div className="col-sm-12 text-center">
                        <div className="card">
                            <div className="card-body">
                                <p className="card-text pt-3 pb-3">
                                    {t('general.msg.nodashboard')}
                                </p>
                            </div>
                        </div>
                    </div>
                }

            </div>

        </div>
    )
}

export default  withTranslation()(Home)
