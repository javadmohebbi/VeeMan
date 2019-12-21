import i18n from '../../i18n'
import { WebUiConf } from '../../configs'

const JWT_TOKEN_KEY = "jwToken"

// Is user authenticated ?
export const isAuthenticated = () => {
    if (typeof window == "undefined") {
        return false
    }

    if (localStorage.getItem(JWT_TOKEN_KEY)) {
        return JSON.parse(localStorage.getItem(JWT_TOKEN_KEY))
    }
    
    return false    
}


// Logout 
export const ApiLogout = () => {
    if (typeof window == "undefined") {
        return
    }


    if (localStorage.getItem(JWT_TOKEN_KEY)) {
        localStorage.removeItem(JWT_TOKEN_KEY)
    }

}


// Login to Server
export const ApiLogin = user => {
    
    const t = i18n.getFixedT()    

    // const apiURL = (`${process.env.REACT_APP_API_BASE}auth/login`)    
    const apiURL = (`${WebUiConf().apiURL}/auth/login`)
    // console.log(apiURL)
    
    return fetch(apiURL, {
        method: "POST",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        body: JSON.stringify(user)
    })
    .then(response => response.json())
    .then(json => {    
        console.log(json)  
        if (json.hasOwnProperty('error') && json.error !== "") {
            return {
                message: t("general.err.auth.invalid"),
                error: true                
            }
        }
        localStorage.setItem(JWT_TOKEN_KEY, JSON.stringify(json))
        return json
    })
    .catch(err => { 
        return {
            message: t("general.err.server.connection"),
            error: true,
            err
        }
    })
}