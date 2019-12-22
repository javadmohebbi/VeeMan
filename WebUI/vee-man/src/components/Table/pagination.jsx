import React from 'react'
import { withTranslation } from 'react-i18next'

const VeeManTablePagination = (props) => {
  const {pagination, handleChangePagination} = props


  const Pagination = () => {
    if (pagination.total_pages > 1 ) {
      let pgs = []
      for (var i=1; i <= pagination.total_pages; i++) {
        var cls = pagination.page === i ? "warning" : "secondary"
        pgs.push({
          page: i,
          cls: cls
        })
      }

      return (        
        pgs.map((btn, index) => (
          <button key={index} onClick={e => {e.preventDefault(); handleChangePagination(btn.page)} } className={`btn btn-${btn.cls} px-2`}>
            {btn.page}
          </button>
        ))
      )
    } else {
      return (
        <>
        </>
      )
    }


  }

  return (
    <div className="text-right mr-3 ml-3 mb-3">
      <div className="btn-group btn-group-sm">
        <Pagination />
      </div>
    </div>
  )

}



export default withTranslation()(VeeManTablePagination)
