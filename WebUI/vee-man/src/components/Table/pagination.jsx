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

      var dts = false
      const ThreeDot = ({index}) => {
        if (!dts) {
          dts = true
          return (
            <>{'...'}</>
          )
        } else {
          return null
        }
      }

      const Buttons = ({index, btn}) => (
        <>
        {
          pgs.length < 5 ?
            <button key={index} onClick={e => {e.preventDefault(); handleChangePagination(btn.page)} } className={`btn btn-${btn.cls} px-2`}>
              {btn.page}
            </button>
          :
          <>
            {
              index === 0 ?
              <button key={index} onClick={e => {e.preventDefault(); handleChangePagination(1)} } className={`btn btn-${btn.cls} px-2`}>
                1
              </button>
              :
              null
            }
            <ThreeDot index={index} />
            {
              index === pagination.total_pages-1 ?
              <button key={index} onClick={e => {e.preventDefault(); handleChangePagination(pagination.total_pages)} } className={`btn btn-${btn.cls} px-2`}>
                {pagination.total_pages}
              </button>
              :
              null
            }
          </>
        }
        </>
      )

      return (
        <>
        {
          pagination.page > 1 && pagination.total_pages > 5 ?
          <button onClick={e => {e.preventDefault(); handleChangePagination(pagination.page - 1)} } className={`btn btn-info px-2`}>
            {'<'}
          </button>
          :
          null
        }
        {
          pgs.map((btn, index) => (
            <Buttons key={index} index={index} btn={btn}/>
          ))
        }
        {
          pagination.page < pagination.total_pages && pagination.total_pages > 5 ?
          <button onClick={e => {e.preventDefault(); handleChangePagination(pagination.page + 1)} } className={`btn btn-info px-2`}>
            {'>'}
          </button>
          :
          null
        }
        </>
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
        {
          pagination.total === 0 ? null :
          <span className="mr-3 mt-1 text-warning" >
            { pagination.total === 0 ? '0' : (pagination.page * pagination.pageSize - pagination.pageSize) + 1 } { ' to ' } { (pagination.page * pagination.pageSize > pagination.total ? pagination.total :  pagination.page * pagination.pageSize ) } {' of total '} {pagination.total} { pagination.total > 1 ? ' results' : 'result' }
          </span>
        }
       <Pagination />
      </div>
    </div>
  )

}



export default withTranslation()(VeeManTablePagination)
