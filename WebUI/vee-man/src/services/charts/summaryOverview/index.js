import i18n from '../../../i18n'
import { WebUiConf } from '../../../configs'
import { isAuthenticated } from '../../auth'

import { getChartBasedOnType } from '../../../configs/charts'

import { getNeededDataType } from '../../../configs/dataTypes/dataTypes'


// Summary Overview
export const getSummaryOverviewFromServer = (chartType) => {
    const t = i18n.getFixedT()

    // const apiURL = (`${process.env.REACT_APP_API_BASE}auth/login`)
    const apiURL = (`${WebUiConf().apiURL}/ui/statistics/summary/overview`)

    return fetch(apiURL, {
        method: "GET",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "Authorization": isAuthenticated().token
        }
    })
    .then(response => response.json())
    .then(json => {
        if (json.hasOwnProperty('error') && json.error !== false) {
            return {
                message: t("general.err.charts.get"),
                error: true
            }
        }

        var ct = getChartBasedOnType(chartType.chart.type || chartType.chart.Type)
        var respConverted = null
        if (typeof ct.dataType !== 'undefined') {
          var dt = getNeededDataType(ct.dataType)
          if (typeof dt.convertFunc !== 'undefined') {
            respConverted = dt.convertFunc(json[ct.responseJsonKey])
          }
        }

        return {
          i18n: ct.i18n,
          stat: respConverted
        }
    })
    .catch(err => {
        return {
            message: t("general.err.server.connection"),
            error: true,
            err
        }
    })

}



// VMs Summary Overview
export const getVMsSummaryOverviewFromServer = (chartType) => {
    const t = i18n.getFixedT()

    // const apiURL = (`${process.env.REACT_APP_API_BASE}auth/login`)
    const apiURL = (`${WebUiConf().apiURL}/ui/statistics/summary/overview/vms`)

    return fetch(apiURL, {
        method: "GET",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "Authorization": isAuthenticated().token
        }
    })
    .then(response => response.json())
    .then(json => {
        if (json.hasOwnProperty('error') && json.error !== false) {
            return {
                message: t("general.err.charts.get"),
                error: true
            }
        }
        // return json.result

        var ct = getChartBasedOnType(chartType.chart.type || chartType.chart.Type)
        var respConverted = null
        if (typeof ct.dataType !== 'undefined') {
          var dt = getNeededDataType(ct.dataType)
          if (typeof dt.convertFunc !== 'undefined') {
            respConverted = dt.convertFunc(json[ct.responseJsonKey])
          }
        }

        return {
          i18n: ct.i18n,
          stat: respConverted
        }

    })
    .catch(err => {
        return {
            message: t("general.err.server.connection"),
            error: true,
            err
        }
    })

}



// Jobs Statistics
export const getJobStatisticsOverviewFromServer = (chartType) => {
    const t = i18n.getFixedT()

    // const apiURL = (`${process.env.REACT_APP_API_BASE}auth/login`)
    const apiURL = (`${WebUiConf().apiURL}/ui/statistics/job/statistics`)

    return fetch(apiURL, {
        method: "GET",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "Authorization": isAuthenticated().token
        }
    })
    .then(response => response.json())
    .then(json => {
        if (json.hasOwnProperty('error') && json.error !== false) {
            return {
                message: t("general.err.charts.get"),
                error: true
            }
        }
        // return json.result

        var ct = getChartBasedOnType(chartType.chart.type || chartType.chart.Type)
        var respConverted = null
        if (typeof ct.dataType !== 'undefined') {
          var dt = getNeededDataType(ct.dataType)
          if (typeof dt.convertFunc !== 'undefined') {
            respConverted = dt.convertFunc(json[ct.responseJsonKey])
          }
        }

        return {
          i18n: ct.i18n,
          stat: respConverted
        }

    })
    .catch(err => {
        return {
            message: t("general.err.server.connection"),
            error: true,
            err
        }
    })

}


// Processed Virtual Machines
export const getProcessedVMsFromServer = (chartType) => {
    const t = i18n.getFixedT()

    // const apiURL = (`${process.env.REACT_APP_API_BASE}auth/login`)
    const apiURL = (`${WebUiConf().apiURL}/ui/statistics/summary/processed_vms`)

    return fetch(apiURL, {
        method: "GET",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "Authorization": isAuthenticated().token
        }
    })
    .then(response => response.json())
    .then(json => {
        if (json.hasOwnProperty('error') && json.error !== false) {
            return {
                message: t("general.err.charts.get"),
                error: true
            }
        }
        // return json.result

        var ct = getChartBasedOnType(chartType.chart.type || chartType.chart.Type)
        var respConverted = null
        if (typeof ct.dataType !== 'undefined') {
          var dt = getNeededDataType(ct.dataType)
          if (typeof dt.convertFunc !== 'undefined') {
            respConverted = dt.convertFunc(json[ct.responseJsonKey])

          }
        }

        var arr = []

        json[ct.responseJsonKey].forEach(e => {
          var data = e[ct.responseJsonChildKey]

          dt = getNeededDataType(ct.childType)
          if (typeof dt.convertFunc !== 'undefined') {
            respConverted = dt.convertFunc(data)
            var datetime = new Date(e['Timestamp'])
            // var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
            // var days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
            // datetime = datetime.getYear() + '-' + months[datetime.getMonth()] + '-' + datetime.getDay()
            datetime = formatDate(datetime, 'd MMM yyyy')
            arr.push(
              {
                label: datetime, value: respConverted
              }
            )
          }
        })
        return arr

    })
    .catch(err => {
        return {
            message: t("general.err.server.connection"),
            error: true,
            err
        }
    })

}


// Repository Overview
export const getRepositoryOverviewFromServer = (chartType) => {
    const t = i18n.getFixedT()

    // const apiURL = (`${process.env.REACT_APP_API_BASE}auth/login`)
    const apiURL = (`${WebUiConf().apiURL}/ui/statistics/summary/repository`)

    return fetch(apiURL, {
        method: "GET",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "Authorization": isAuthenticated().token
        }
    })
    .then(response => response.json())
    .then(json => {
        if (json.hasOwnProperty('error') && json.error !== false) {
            return {
                message: t("general.err.charts.get"),
                error: true
            }
        }
        // return json.result

        var ct = getChartBasedOnType(chartType.chart.type || chartType.chart.Type)
        // var respConverted = null
        // if (typeof ct.dataType !== 'undefined') {
        //   var dt = getNeededDataType(ct.dataType)
        //   if (typeof dt.convertFunc !== 'undefined') {
        //     respConverted = dt.convertFunc(json[ct.responseJsonKey])
        //
        //   }
        // }
        var data = []
        // console.log(json[ct.responseJsonKey]);
        json[ct.responseJsonKey].forEach((e, i) => {
          // data.push({Label: e['Name'], y: [e['Capacity'], e['FreePercent']]})
          data.push({Label: e['Name'],
            y: [
              {data: e['Capacity'], caption: 'Capacity', forMixed: false},
              {data: e['FreePercent'], caption: 'FreeSpace %', forMixed: true}
            ]
          })
        })

        // console.log(data);

        return data

    })
    .catch(err => {
        return {
            message: t("general.err.server.connection"),
            error: true,
            err
        }
    })

}














function formatDate(date, format, utc) {
    var MMMM = ["\x00", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    var MMM = ["\x01", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    var dddd = ["\x02", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    var ddd = ["\x03", "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    function ii(i, len) {
        var s = i + "";
        len = len || 2;
        while (s.length < len) s = "0" + s;
        return s;
    }

    var y = utc ? date.getUTCFullYear() : date.getFullYear();
    format = format.replace(/(^|[^\\])yyyy+/g, "$1" + y);
    format = format.replace(/(^|[^\\])yy/g, "$1" + y.toString().substr(2, 2));
    format = format.replace(/(^|[^\\])y/g, "$1" + y);

    var M = (utc ? date.getUTCMonth() : date.getMonth()) + 1;
    format = format.replace(/(^|[^\\])MMMM+/g, "$1" + MMMM[0]);
    format = format.replace(/(^|[^\\])MMM/g, "$1" + MMM[0]);
    format = format.replace(/(^|[^\\])MM/g, "$1" + ii(M));
    format = format.replace(/(^|[^\\])M/g, "$1" + M);

    var d = utc ? date.getUTCDate() : date.getDate();
    format = format.replace(/(^|[^\\])dddd+/g, "$1" + dddd[0]);
    format = format.replace(/(^|[^\\])ddd/g, "$1" + ddd[0]);
    format = format.replace(/(^|[^\\])dd/g, "$1" + ii(d));
    format = format.replace(/(^|[^\\])d/g, "$1" + d);

    var H = utc ? date.getUTCHours() : date.getHours();
    format = format.replace(/(^|[^\\])HH+/g, "$1" + ii(H));
    format = format.replace(/(^|[^\\])H/g, "$1" + H);

    var h = H > 12 ? H - 12 : H === 0 ? 12 : H;
    format = format.replace(/(^|[^\\])hh+/g, "$1" + ii(h));
    format = format.replace(/(^|[^\\])h/g, "$1" + h);

    var m = utc ? date.getUTCMinutes() : date.getMinutes();
    format = format.replace(/(^|[^\\])mm+/g, "$1" + ii(m));
    format = format.replace(/(^|[^\\])m/g, "$1" + m);

    var s = utc ? date.getUTCSeconds() : date.getSeconds();
    format = format.replace(/(^|[^\\])ss+/g, "$1" + ii(s));
    format = format.replace(/(^|[^\\])s/g, "$1" + s);

    var f = utc ? date.getUTCMilliseconds() : date.getMilliseconds();
    format = format.replace(/(^|[^\\])fff+/g, "$1" + ii(f, 3));
    f = Math.round(f / 10);
    format = format.replace(/(^|[^\\])ff/g, "$1" + ii(f));
    f = Math.round(f / 10);
    format = format.replace(/(^|[^\\])f/g, "$1" + f);

    var T = H < 12 ? "AM" : "PM";
    format = format.replace(/(^|[^\\])TT+/g, "$1" + T);
    format = format.replace(/(^|[^\\])T/g, "$1" + T.charAt(0));

    var t = T.toLowerCase();
    format = format.replace(/(^|[^\\])tt+/g, "$1" + t);
    format = format.replace(/(^|[^\\])t/g, "$1" + t.charAt(0));

    var tz = -date.getTimezoneOffset();
    var K = utc || !tz ? "Z" : tz > 0 ? "+" : "-";
    if (!utc) {
        tz = Math.abs(tz);
        var tzHrs = Math.floor(tz / 60);
        var tzMin = tz % 60;
        K += ii(tzHrs) + ":" + ii(tzMin);
    }
    format = format.replace(/(^|[^\\])K/g, "$1" + K);

    var day = (utc ? date.getUTCDay() : date.getDay()) + 1;
    format = format.replace(new RegExp(dddd[0], "g"), dddd[day]);
    format = format.replace(new RegExp(ddd[0], "g"), ddd[day]);

    format = format.replace(new RegExp(MMMM[0], "g"), MMMM[M]);
    format = format.replace(new RegExp(MMM[0], "g"), MMM[M]);

    format = format.replace(/\\(.)/g, "$1");

    return format;
};
