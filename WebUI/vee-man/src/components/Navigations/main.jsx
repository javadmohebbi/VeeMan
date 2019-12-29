import React from 'react'
import {withTranslation} from 'react-i18next'
import {NavLink} from 'react-router-dom'
import {withRouter} from 'react-router'
import {isAuthenticated} from '../../services/auth'

import './main.css'




const MainNav = (props) => {

    const {t, location} = props
    const [activeItem, setActiveItem] = React.useState(location.pathname)


    const menuItems = [
        {
            title:  t("general.nav.query"),
            key: "/mgmt/query",
            to: '/mgmt/query',
            icon: 'fas fa-magic',
        },
        {
            title:  t("general.nav.queries"),
            key: "mgmt/queries",
            to: '/mgmt/queries',
            icon: 'fas fa-list',
        },
    ]

    const getActiveClass = (key) => {
        if (activeItem === "/" + key) {
            return " active "
        } else return " "
    }

    const handleMenuClicked = (item) => {
        setActiveItem("/" + item)
        return
    }




    const Brand = () => (
        <a href={"/"} className="navbar-brand"  onClick={() => handleMenuClicked("/homeBrand")}>
            <img src="/images/fav.png" alt="Logo" className="img-fluid pr-1 pl-2" style={{maxWidth: '40px'}} />
            {t("general.app.short")}
        </a>
    )

    return (
        <div className="container-fluid" style={{padding: "0", margin: "0"}}>
            <nav className="main-nav navbar navbar-dark navbar-expand-lg fixed-top position-fixed main-nav-bg">
                <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#mainNav" aria-controls="mainNav" aria-expanded="false"
                    aria-label="Toggle navigation">
                    <i className="fas fa-bars"></i>
                </button>
                <Brand className=""/>
                {/* <Subscribe className="mr-auto"/>            */}
                <div className="collapse navbar-collapse" id="mainNav" >
                    {/* <Brand className="d-sm-none"/> */}
                    <ul className="navbar-nav mr-auto mt-2 mt-lg-0">
                        {
                            menuItems.map((menu) => (
                                <li key={menu.key === "/" ? "home" : menu.key} className={`nav-item`}   >
                                    <NavLink to={menu.to} className="nav-link" activeClassName="active" onClick={() => handleMenuClicked(menu.key)}>
                                        {
                                            menu.icon !== '' ? <i className={menu.icon}></i> : ""
                                        }
                                        {menu.title} {getActiveClass(menu.key) === " active " ? <span className="sr-only">(current)</span> : ""}
                                    </NavLink>
                                </li>
                            ))
                        }
                    </ul>
                    <ul className="navbar-nav mt-2">
                        <li className="nav-item dropdown">
                            <a className="nav-link dropdown-toggle" href="#user" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                {isAuthenticated().email}
                            </a>
                            <div className="dropdown-menu bg-dark text-light" aria-labelledby="navbarDropdown">
                                <NavLink to="/logout" className="dropdown-item bg-dark text-light" >
                                    <i className="fas fa-sign-out-alt pr-2"></i>
                                    {t('titles.signout')}
                                </NavLink>
                            </div>

                        </li>
                    </ul>

                    {/* <Subscribe className="d-none"/> */}
                </div>

            </nav>
            <div className="mt-5 pt-2">&nbsp;</div>
        </div>
    )

}


export default withRouter(withTranslation()(MainNav))
