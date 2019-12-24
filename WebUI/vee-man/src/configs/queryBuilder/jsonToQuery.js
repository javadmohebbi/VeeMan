export const GetQueryString = (queries, grouping, queryType) => {
  if (queryType==='') { return '' }  
  var str = 'type=' + queryType
  var filters = []
  for (var i=0; i<queries.length; i++) {
    var flt = getFilters(queries[i])
    if (flt !== '') { filters.push(flt) }
    // console.log(queries[i]);
  }
  if (filters.length === 0) {
    return str
  } else if (filters.length === 1) {
    return str+'&filter='+filters[0]
  } else {
    return groupQueries(queries, filters, grouping, str)
  }
}

// get queries and group them
const groupQueries = (queries, filters, grouping, qs) => {
  var str = qs
  var i
  var filterOperators = []
  var grpOperator = ';'
  for (i=0; i<queries.length; i++) {
    grpOperator = ';'
    for (var j=0; j<grouping.length; j++) {
      if (grouping[j].queryId === queries[i].queryId) {
        grpOperator = grouping[j].operator
        break;
      }
    }
    if (i===0) {
      filterOperators.push('')
    } else {
      filterOperators.push(grpOperator)
    }
  }
  for (i=0; i<filters.length; i++) {
    var f = '%FLTS' + i + '%'
    var g = ''
    if (i===0) {
      str += '&filter='
      g = ''
    } else {
      g = '%OPR' + i + '%'
    }
    str += g + f
    if (i>0) {
      str = str.replace(g, filterOperators[i])
    }
    if (filters.length === 1) {
      str = str.replace(f, filters[i])
    } else {
      str = str.replace(f, '(' + filters[i] + ')')
    }
  }

  return str
}


// getFilters string from queries
const getFilters = (query) => {

  var strFilter = ''

  // If not there is no filter , return ''
  if (query.filters.length === 0 ) { return '' }

  for (var i=0; i<query.filters.length; i++) {

    // if filters is not filled, return ''
    if (query.filters[i].field === '' || query.filters.value === '') {
      continue;
    }

    if (i > 0) {
      strFilter += query.filters[i].logicalOperator;
    }

    var val = query.filters[i].value.replace(/"/g, '""')
    strFilter += query.filters[i].field + query.filters[i].comparisonOperator +
                 '"' + val + '"';
  }

  return strFilter
}
