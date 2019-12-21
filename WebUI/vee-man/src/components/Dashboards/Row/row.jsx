import React from 'react'
import { withTranslation } from 'react-i18next'



const Row = (props) => {

  const { dataGrid, key } = props

  return (
    <div style={{width: '50%', height: '50%', background: 'red'}} className="">
      <span className="text">WIDTH</span>
    </div>
  )

}


export default withTranslation()(Row)
