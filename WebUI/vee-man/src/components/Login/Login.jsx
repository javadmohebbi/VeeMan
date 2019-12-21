import React, {useState, useEffect} from 'react'
import {withTranslation} from 'react-i18next'
import {useHistory} from 'react-router-dom'
import { isAuthenticated, ApiLogin } from '../../services/auth'
import './login.css'
import LightSpinner from '../Loading/Spinner/Light'

const Login = (props) => {

    const {t} = props

    useEffect(()=> {
      document.title = t('general.app.long') + ' | ' + t('general.inp.signin')
    }, [t])


    const [state, setState] = useState({
        username: '', password: ''
    })



    const [busy, setBusy] = useState(false)
    const [err, setError] = React.useState(false);
    const [errMsg, setErrorMsg] = React.useState("");

    const [isAuth, setIsAuth] = useState(false)
    const h = useHistory()

    useEffect(() => {
        setBusy(false)
        if (isAuthenticated() !== false) {
            setIsAuth(true)
            h.replace('/home?loginOk')
            h.go('/home')
            h.push('/home')
            return '...'
        }
    }, [isAuth, h])


    const handleSubmit = (event) => {
        event.preventDefault()
        setBusy(true)
        setError(false)

        const user = {
            email: state.username,
            password: state.password
        }

        ApiLogin(user).then(data => {

          if (!data.hasOwnProperty('error')){
            // OK
            setIsAuth(true)
          } else {
            setBusy(false)
            setError(true)
            setErrorMsg(data.message)
          }
        })
    }





    if (!isAuth) {
        return (
            <div className="login-form-parent">
                <div className="form-sign-in">
                    <img src="images/VeeMan-Horizontal.png" style={{width: "192px"}} alt="Logo" className="mb-4"/>
                    <h1 className="h3 mb-5 mt-3 font-weight-normal">
                        {t('titles.signin')}
                    </h1>

                    <div className="row mt-3">
                        <div className="col-sm-8 offset-sm-2 col-md-6 offset-md-3 col-lg-4 offset-lg-4">
                            <label htmlFor="inputEmail" className="sr-only">{t('general.inp.email')}</label>
                            <input type="email" id="inputEmail" value={state.username} onChange={e => setState({...state, username: e.target.value})} className="form-control" placeholder={t('general.inp.email')} required=""/>

                            <div className="mb-4"></div>

                            <label htmlFor="inputPassword" className="sr-only">{t('general.inp.password')}</label>
                            <input type="password" id="inputPassword" value={state.password} onChange={e => setState({...state, password: e.target.value})} className="form-control" placeholder={t('general.inp.password')} required="" />

                            <div className="mb-4"></div>

                            <div className="text-right">
                                <button  onClick={handleSubmit} className="btn btn-warning">

                                    {
                                        busy ?
                                        (
                                            <LightSpinner />
                                        )
                                        :
                                        <>
                                        {t('general.inp.signin')}
                                        </>
                                    }
                                </button>
                            </div>
                            <div className="mb-4"></div>
                            {
                                err ?
                                (
                                    <p className="text-warning">
                                        {errMsg}
                                    </p>
                                )
                                :
                                <></>
                            }

                        </div>
                    </div>

                </div>
            </div>
        )
    } else {
        // setTimeout(() => {
        //     h.replace('/home?loginOk')
        //     h.go('/home')
        //     h.push('/home')
        //     return '...'
        //   }, 1000);
        return ' '
    }

}



export default withTranslation()(Login)
