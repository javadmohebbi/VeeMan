import React from 'react'
import { withTranslation } from 'react-i18next'

import VeeManTablePagination from './pagination'

import { GetPaginatedItems } from '../../configs/pagination'
import _ from 'lodash'

const VeeManTable = (props) => {

  const { Thead, Trows, notAvailableCols=4, t, listKey=null } = props

  const [pagination,setPagination] = React.useState({
    page: 1,
    pageSize: 10,
    total: 0,
    total_pages: 1,
    data: []
  })
  const [firstInit, setFirstInit] = React.useState(true)

  const [filter, setFilter] = React.useState('')

  const [theList, setTheList] = React.useState([])



  React.useEffect(() => {
    if (props.list.length > 0 && firstInit) {
      setTheList(props.list)
    }
  }, [props.list, firstInit])


  React.useEffect(() => {
    if (theList.length > 0 && firstInit) {
      setFirstInit(false)
      setPagination(GetPaginatedItems(theList, pagination.page, pagination.pageSize))
    }
  }, [theList,firstInit, pagination])

  const handleChangePagination = (page) => {
    setPagination(GetPaginatedItems(theList, page, pagination.pageSize))
  }



  const handleTxtFilterChanged = (e) => {
    e.preventDefault()
    setFilter(e.target.value)
    if (e.target.value === '') {
      setTheList(props.list)
      setPagination(GetPaginatedItems(props.list, 1, pagination.pageSize))
    } else {
      var result = _.map(props.list, l => {
        var flt = _.filter(l, (o) => {
          var rt = _.values(o)
          rt = _.map(rt, o => {
            return o.toString().toLowerCase()
          })
          return _.includes(
            rt,  e.target.value.toLowerCase()
          )
        });
        if (flt.length === 0) {
          return undefined
        } else {
          return flt
        }
      })
      result = _.without(result, undefined)
      var newArray = []
      var i = 0
      if (listKey !== null) {
        for (i=0; i < result.length; i++) {
          var obj = {}
          obj[listKey] = result[i][0]
          newArray.push(obj)
        }
      } else {
        for (i=0; i < result.length; i++) {
          newArray.push(result[i][0])
        }
      }
      setTheList(newArray)
      setPagination(GetPaginatedItems(newArray, 1, pagination.pageSize))
    }
  }


  return (
    <>


    <div className="mr-3 ml-3 mb-3 float-left">
      <div className="input-group btn-group-sm">
        <div className="input-group-prepend">
          <span className="input-group-text" id="basic-addon1"><i className="fas fa-filter"></i></span>
        </div>
        <input type="text" className="form-control" placeholder={t('general.inp.filter')}
          size="40"
          aria-label={t('general.inp.filter')}
          onChange={handleTxtFilterChanged}
          value={filter} aria-describedby="basic-addon2" />
      </div>
    </div>

    <VeeManTablePagination pagination={pagination} handleChangePagination={handleChangePagination} />

    <div className="pr-3 pl-3">
      <table className="table table-dark table-striped table-hover">
        <thead>
          <tr>
            <Thead />
          </tr>
        </thead>
        <tbody>
        {
          props.list.length > 0 ?
          <Trows rows={pagination.data} />
          :
          <tr>
            <td colSpan={notAvailableCols}>N/A</td>
          </tr>
        }
        </tbody>
      </table>
    </div>

    <VeeManTablePagination pagination={pagination} handleChangePagination={handleChangePagination} />

    </>
  )

}


export default withTranslation()(VeeManTable)
