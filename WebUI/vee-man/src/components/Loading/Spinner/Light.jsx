import React from 'react'


const LightSpinner = (props) => {

    let {spinnerSize} = props
    let {spinnerKind} = props

    switch (spinnerKind) {
        case "grow":
            spinnerKind = "grow"            
            break;
    
        default:
            spinnerKind = "border"
            break;
    }

    switch (spinnerSize) {
        case "sm":            
            spinnerSize = "spinner-" + spinnerKind + "-sm mb-1"
            break;
    
        default:
            spinnerSize = ""
            break;
    }

    

    return (
        <div className={`spinner-${spinnerKind} ${spinnerSize} text-light`} role="status">
            <span className="sr-only">...</span>
        </div>
    )

}


export default LightSpinner