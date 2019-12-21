import React from 'react'
import { withTranslation } from 'react-i18next'


const Rows = (props) => {


  return (

    <div className="widget-wrapper" key={'a'} data-grid={{ w: 2, h: 3, x: 0, y: 0, minW: 2, minH: 3 }} >
      <span className="text">asdj hasjkdhj ashjdhajks hjaskdhkashdkjdash</span>
    </div>
  )

}


export default withTranslation()(Rows)
