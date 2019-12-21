import React from 'react'

import './mainLoading.css'
import LightSpinner from './Spinner/Light'

const MainLoading = (props) => {



    return (
        <div className="loading">
            <img src="images/VeeMan-Horizontal.png" style={{width: "192px"}} alt="Vee Man" className="mb-4"/>            
            <LightSpinner />            
        </div>
    )

}


export default MainLoading