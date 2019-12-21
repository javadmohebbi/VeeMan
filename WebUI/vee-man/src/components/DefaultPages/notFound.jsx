import React from 'react'
import { withTranslation } from 'react-i18next'

import { Link } from 'react-router-dom'

import './notFound.css'

const NotFound = (props) => {

    return (
        <div className="container-fluid grd-bg-dark text-light notfound" style={{minHeight: '400px'}}>
            <div className="container pt-5">
                <div className="row pt-5">
                    <div className="col-12 col-md-6 text-center">
                        <h1>
                            404
                        </h1>
                    </div>
                    <div className="col-12 col-md-6 text-center mt-10">
                        <h2>
                            Page you're looking for is not found! <br/><Link to="/" >Take me Home!</Link><br/><br/>
                        </h2>
                    </div>
                </div>
            </div>
        </div>   
    )
}


export default withTranslation()(NotFound)