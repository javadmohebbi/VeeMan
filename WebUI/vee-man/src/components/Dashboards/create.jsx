import React from 'react'
import {withTranslation} from 'react-i18next'
import { useHistory } from "react-router-dom";
import { CreateNewDashboard } from '../../services/dashboards';
import LightSpinner from '../Loading/Spinner/Light';


const CreateDashboard = (props) => {

    let h = useHistory();


    const {t} = props

    React.useEffect(()=> {
      document.title = t('general.app.long') + ' | ' + t('general.btn.createDashboard')
    }, [t])

    const [state, setState] = React.useState({
        name: '', desc: ''
    })


    const [busy, setBusy] = React.useState(false)
    const [err, setError] = React.useState(false);
    const [errMsg, setErrorMsg] = React.useState([]);



    const handleSave = (e) => {
        if (state.name === "") { return }
        e.preventDefault()
        CreateNewDashboard(state).then(data => {
            if (data !== null && !data.hasOwnProperty('error')){
                h.push(`/dashboard/edit/${data}?created=true`)
            } else {
                setBusy(false)
                setError(true)
                setErrorMsg(data.ErrorMessages)
            }
        })
    }

    return (
        <div className="container-fluid mt-5">
            <div className="row">
                <div className="col-sm-8 offset-sm-2 col-md-9 offset-md-1 col-lg-6 offset-lg-3">
                    <h1 className="page-title">
                        Create a new dashboard
                    </h1>

                    <label htmlFor="inputname" className="sr-only">{t('general.inp.name')}</label>
                    <input type="text" id="inputname"
                        value={state.name} onChange={e => setState({...state, name: e.target.value})}
                        className="form-control mb-3" placeholder={t('general.inp.name')} required=""/>

                      { /*
                    <label htmlFor="inputDesc" className="sr-only">{t('general.inp.desc')}</label>
                    <input type="text" id="inputDesc"
                        value={state.desc} onChange={e => setState({...state, desc: e.target.value})}
                        className="form-control mb-3" placeholder={t('general.inp.desc')} required=""/>
                      */}

                    <div  style={{float: 'right'}}>
                        <button onClick={handleSave}
                            className={ state.name !== "" ? " btn btn-warning  " : "btn btn-warning  disabled" }
                        >
                            {
                                busy ?
                                (
                                    <LightSpinner />
                                )
                                :
                                <>
                                    <i className="fas fa-save pr-2"></i>
                                    {t('general.btn.save')}
                                </>
                            }

                        </button>
                    </div>
                    <div className="" style={{float: 'left'}}>
                        <button className="btn btn-secondary"
                            onClick={() => h.goBack()}
                        >
                            <i className="fas fa-arrow-left pr-2"></i>
                            {t('general.btn.goback')}
                        </button>
                    </div>




                </div>
                <div className="col-sm-8 offset-sm-2 col-md-9 offset-md-1 col-lg-6 offset-lg-3">
                    <div className="mb-4"></div>
                    {
                        err ?
                        (
                            errMsg.map((e, i) => (
                                <p key={i} className="text-warning">
                                    {e.Message + ` (ERR-${e.Code})`}
                                </p>
                            ))
                        )
                        :
                        <></>
                    }
                </div>

            </div>
        </div>
    )

}

export default withTranslation()(CreateDashboard)
