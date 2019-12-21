import React from 'react'
import { withTranslation } from 'react-i18next'


import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Toastification = (props) => {

  const { containerId = 'default', position=toast.POSITION.BOTTOM_RIGHT } = props

  return (
    <ToastContainer enableMultiContainer containerId={containerId} position={position} />
  )

}


export default withTranslation()(Toastification)
