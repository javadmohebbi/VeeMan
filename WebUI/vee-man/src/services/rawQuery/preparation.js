import Pluralize from 'pluralize'

export const PrepareResult = (result, title, pluralTitle) => {
  var titles = []
  var data = []
  var refType = ''
  var retObj = {
    titles: titles,
    data: data,
    refType: refType
  }

  if (typeof result === 'undefined' || result === null || result === '') {
    return retObj
  }

  var arr = []

  if(result[title].constructor === Object){
    retObj.titles = Object.keys(result[title])
  }
  else if(result[title].constructor === Array){
    arr = result[title].map(res => res)
    if (arr.length > 0 ) {
      retObj.titles = retObj.titles = Object.keys(arr[0])
    }
  } else {
    return retObj
  }

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
