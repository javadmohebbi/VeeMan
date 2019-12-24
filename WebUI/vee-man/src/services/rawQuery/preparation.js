import Pluralize from 'pluralize'

export const PrepareResult = (result, title, pluralTitle) => {
  var titles = []
  var data = []
  var refType = ''
  var dataType = []
  var retObj = {
    titles: titles,
    data: data,
    refType: refType,
    dataType: dataType,
  }

  if (typeof result === 'undefined' || result === null || result === '') {
    return retObj
  }

  var arr = []

  if(result[title].constructor === Object){
    titles = Object.keys(result[title])
    data.push(Object.values(result[title]))
  }
  else if(result[title].constructor === Array){
    arr = result[title].map(res => res)
    if (arr.length > 0 ) {
      titles = Object.keys(arr[0])
    }
    for (var j=0; j<arr.length; j++) {
      data.push(Object.values(arr[j]))
    }
  } else {
    return retObj
  }

  for (j=0; j<data[0].length; j++) {
    dataType.push(typeof data[0][j])
  }

  retObj.titles = titles
  retObj.data = data
  retObj.refType = data[0][titles.indexOf('Type')];
  retObj.dataType = dataType

  console.log(retObj);

  return retObj
}



export const ConvertQueryResultToResult = (queryResult, title) => {
  var retObj = {
    result: null,
    title: null,
    pluralTitle: null,
  }

  var ttl = title
  var customTtl = null
  var plTtl = null
  switch (ttl) {
    case 'Credentials':
      // ttl = 'CredentialsList'
      plTtl = 'CredentialsList'
      customTtl = 'CredentialsInfo'
      break;
    case 'ObjectInJob':
      plTtl = 'ObjectsInJob'
      customTtl = 'ObjectInJob'
      break;
    default:
      plTtl = null
      break;
  }

  if (plTtl === null) {
    if (ttl !== '' && queryResult !== null) {
      var tmpTitle = plTtl===null ? Pluralize(ttl) : plTtl
      if (queryResult.hasOwnProperty(ttl)) {
        retObj.result = queryResult[title]
        retObj.pluralTitle = null
      } else if (queryResult.hasOwnProperty(tmpTitle)) {
        retObj.result = queryResult[tmpTitle]
        retObj.pluralTitle = tmpTitle
      } else {
        retObj.result = null
        retObj.pluralTitle = null
      }
    }
  } else {
    retObj.result = queryResult[plTtl]
    retObj.pluralTitle = plTtl
  }

  if (plTtl !== null) {
    retObj.title = customTtl
  } else {
    retObj.title = ttl
  }

  return retObj
}
