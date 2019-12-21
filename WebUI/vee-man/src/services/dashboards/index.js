import i18n from '../../i18n'
import { WebUiConf } from '../../configs'
import { isAuthenticated } from '../auth'



export const getUsersDashboards = () => {
    const t = i18n.getFixedT()

    // const apiURL = (`${process.env.REACT_APP_API_BASE}auth/login`)
    const apiURL = (`${WebUiConf().apiURL}/ui/dashboards`)

    return fetch(apiURL, {
        method: "GET",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "Authorization": isAuthenticated().token
        },
    })
    .then(response => response.json())
    .then(json => {
        if (json.hasOwnProperty('error') && json.error !== false) {
            return {
                message: t("general.err.dashboards.all"),
                error: true
            }
        }
        return json.result
    })
    .catch(err => {
        return {
            message: t("general.err.server.connection"),
            error: true,
            err
        }
    })

}

export const getADashboard = (id) => {
    const t = i18n.getFixedT()

    // const apiURL = (`${process.env.REACT_APP_API_BASE}auth/login`)
    const apiURL = (`${WebUiConf().apiURL}/ui/dashboards/get/${id}`)

    return fetch(apiURL, {
        method: "GET",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "Authorization": isAuthenticated().token
        },
    })
    .then(response => response.json())
    .then(json => {
        if (json.hasOwnProperty('error') && json.error !== false) {
            return {
                message: t("general.err.dashboards.one"),
                error: true
            }
        }
        // return json.result
        return {
          dashboard: json.result,
          layouts: json.layouts
        }
    })
    .catch(err => {
        return {
            message: t("general.err.server.connection"),
            error: true,
            err
        }
    })

}

export const CreateNewDashboard = (dashboard) => {
    const t = i18n.getFixedT()

    // const apiURL = (`${process.env.REACT_APP_API_BASE}auth/login`)
    const apiURL = (`${WebUiConf().apiURL}/ui/dashboards/create`)
    const body = JSON.stringify({
        Name: dashboard.name,
        Description: dashboard.desc,
    })

    return fetch(apiURL, {
        method: "POST",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "Authorization": isAuthenticated().token
        },
        body: body
    })
    .then(response => response.json())
    .then(json => {
        if (json.hasOwnProperty('error') && json.error !== false) {
            return {
                ErrorMessages: json.error.Errors,
                error: true
            }
        }
        return json.result
    })
    .catch(err => {
        return {
            message: t("general.err.server.connection"),
            error: true,
            err
        }
    })
}

export const UpdateDashboardLayout = ({id, layouts}) => {
    const t = i18n.getFixedT()

    // const apiURL = (`${process.env.REACT_APP_API_BASE}auth/login`)
    const apiURL = (`${WebUiConf().apiURL}/ui/dashboards/create/layout`)
    const body = JSON.stringify({
        dashboardId: id,
        layouts: layouts,
    })

    return fetch(apiURL, {
        method: "POST",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "Authorization": isAuthenticated().token
        },
        body: body
    })
    .then(response => response.json())
    .then(json => {
        if (json.hasOwnProperty('error') && json.error !== false) {
            return {
                ErrorMessages: json.error.Errors,
                error: true
            }
        }
        return json.result
    })
    .catch(err => {
        return {
            message: t("general.err.server.connection"),
            error: true,
            err
        }
    })
}

export const deleteADashboard = (id) => {
    const t = i18n.getFixedT()

    // const apiURL = (`${process.env.REACT_APP_API_BASE}auth/login`)
    const apiURL = (`${WebUiConf().apiURL}/ui/dashboards/delete/${id}`)

    return fetch(apiURL, {
        method: "DELETE",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "Authorization": isAuthenticated().token
        },
    })
    .then(response => response.json())
    .then(json => {
        if (json.hasOwnProperty('error') && json.error !== false) {
            return {
                message: t("general.err.dashboards.delete"),
                error: true
            }
        }
        return json.result
    })
    .catch(err => {
        return {
            message: t("general.err.server.connection"),
            error: true,
            err
        }
    })

}

export const updateDashboardTitle = (id, title) => {
    const t = i18n.getFixedT()

    // const apiURL = (`${process.env.REACT_APP_API_BASE}auth/login`)
    const apiURL = (`${WebUiConf().apiURL}/ui/dashboards/update/title/${id}`)

    return fetch(apiURL, {
        method: "PUT",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "Authorization": isAuthenticated().token
        },
        body: JSON.stringify({
          'name': title
        })
    })
    .then(response => response.json())
    .then(json => {
        if (json.hasOwnProperty('error') && json.error !== false) {
            return {
                message: t("general.err.dashboards.updateTitle"),
                error: true
            }
        }
        return json.result
    })
    .catch(err => {
        return {
            message: t("general.err.server.connection"),
            error: true,
            err
        }
    })

}

export const getApiRows = () => {
    const t = i18n.getFixedT()

    // const apiURL = (`${process.env.REACT_APP_API_BASE}auth/login`)
    const apiURL = (`${WebUiConf().apiURL}/ui/rows`)

    return fetch(apiURL, {
        method: "GET",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "Authorization": isAuthenticated().token
        },
    })
    .then(response => response.json())
    .then(json => {
        if (json.hasOwnProperty('error') && json.error !== false) {
            return {
                message: t("general.err.rows.all"),
                error: true
            }
        }
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
