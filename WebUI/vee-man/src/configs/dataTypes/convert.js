export const ExtractUID = (str) => {
  var res = str.split(':')
  return res[res.length-1]
}


export const FormatBytes = (a,b) => {
  var aa = parseInt(a)
  if ( 0 === aa )
    return "0 Bytes";
  var c=1000, d=b||2, e=["Bytes","KB","MB","GB","TB","PB","EB","ZB","YB"], f=Math.floor(Math.log(aa)/Math.log(c));
  return parseFloat((a/Math.pow(c,f)).toFixed(d))+""+e[f]
}


export const FormatIntNumbers = (a) => {
    return formatNumbers(parseInt(a), 0)
}
export const FormatFloatNumbers = (a) => {
    return formatNumbers(parseFloat(a), 2)
}

const formatNumbers = (a,b) => {
    if ( 0 === a )
        return "0";
    var c=1000, d=b||2, e=["","K","M","B","T","Qua","Qui","Se","Sept"], f=Math.floor(Math.log(a)/Math.log(c));
    return parseFloat((a/Math.pow(c,f)).toFixed(d))+""+e[f]
}

export const FormatMiliSeconds = (ms) => {
  var s = parseInt(ms) / 1000
  return FormatSeconds(s)
}

export const FormatNanoSeconds = (ns) => {
  var s = parseInt(ns) / 1000000000
  return FormatSeconds(s)
}

export const FormatSeconds = (seconds,b) => {
    // if ( 0 === a )
    //     return "0";
    // var c=60, d=b||2, e=["Sec","Min","Hour"], f=Math.floor(Math.log(a)/Math.log(c));
    // return parseFloat((a/Math.pow(c,f)).toFixed(d))+" "+e[f]

    if (seconds === '' || seconds === '0' || seconds === 0 ) { return FormatString(undefined) }
    var secs = parseInt(seconds)

    var d=b||2
    var numyears = Math.floor(secs / (86400 * 30 * 12));
    var nummonths = Math.floor(secs / (86400 * 30));
    var numweeks = Math.floor(secs / (86400 * 7));
    var numdays = Math.floor(secs / 86400);
    var numhours = Math.floor((secs % 86400) / 3600);
    var numminutes = Math.floor(((secs % 86400) % 3600) / 60);
    var numseconds = ((secs % 86400) % 3600) % 60;

    var str = ''
    if (numyears !== 0) str += numyears.toFixed(0) + " y" + (numyears > 1 ? "s" : "")
    if (nummonths !== 0) str += (str === '' ? '' : ' ') + nummonths.toFixed(0) + " mon"
    if (numweeks !== 0) str += (str === '' ? '' : ' ') + numweeks.toFixed(0) + " wk"
    if (numdays !== 0) str += (str === '' ? '' : ' ') + numdays.toFixed(0) + " day"
    if (numhours !== 0) str += (str === '' ? '' : ' ') + numhours.toFixed(0) + " hr"
    if (numminutes !== 0) str += (str === '' ? '' : ' ') + numminutes.toFixed(0) + " min"
    if (numseconds !== 0) str += (str === '' ? '' : ' ') + numseconds.toFixed(d) + " sec"

    return FormatString(str)
    // return numdays + " days " + numhours + " hours " + numminutes + " minutes " + numseconds + " seconds";
}

export const FormatString = (str) => {
    if (typeof str !== "undefined" && str !== '' ) {
        return str
    }
    return "N/A"
}


export const FormatPercentage = (str) => {
  return FormatString(str) + '%'
}
