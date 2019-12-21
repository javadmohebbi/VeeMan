import { FormatBytes, FormatString,
  FormatFloatNumbers, FormatIntNumbers,
  FormatSeconds, FormatPercentage,
  FormatMiliSeconds, FormatNanoSeconds
} from './convert'

import _ from 'lodash'

export const DATA_TYPE_STRING = 'string'
export const DATA_TYPE_INT = 'int'
export const DATA_TYPE_FLOAT = 'float'
export const DATA_TYPE_BYTES = 'bytes'
export const DATA_TYPE_PERCENT = 'percent'
export const DATA_TYPE_SECONDS = 'seconds'
export const DATA_TYPE_MILI_SECONDS = 'miliseconds'
export const DATA_TYPE_NANO_SECONDS = 'nanoseconds'



export const getNeededDataType = (reqDataType) => {
  var filtered = _.map(getAllDataTypes() , f => { if (f.dataType === reqDataType) return f } )
  filtered = _.without(filtered, undefined)

  return filtered.length > 0 ? filtered[0] : getNeededDataType(DATA_TYPE_STRING)
}


export const getAllDataTypes = () => {
  return [
    { dataType: DATA_TYPE_STRING, convertFunc: FormatString },
    { dataType: DATA_TYPE_INT, convertFunc: FormatIntNumbers },
    { dataType: DATA_TYPE_FLOAT, convertFunc: FormatFloatNumbers },
    { dataType: DATA_TYPE_BYTES, convertFunc: FormatBytes },
    { dataType: DATA_TYPE_PERCENT, convertFunc: FormatPercentage },
    { dataType: DATA_TYPE_SECONDS, convertFunc: FormatSeconds },
    { dataType: DATA_TYPE_MILI_SECONDS, convertFunc: FormatMiliSeconds },
    { dataType: DATA_TYPE_NANO_SECONDS, convertFunc: FormatNanoSeconds },
  ]
}
