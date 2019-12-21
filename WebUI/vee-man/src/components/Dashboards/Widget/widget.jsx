import React from 'react'
import { withTranslation } from 'react-i18next'

import {getRows} from '../../../services/localstorage'
import { GetWidgetInfo } from '../../../services/charts/getChartInfo'
import { Link } from 'react-router-dom'

// import LightSpinner from '../../Loading/Spinner/Light';

import {
  CHART_TYPE_SINGLE_STAT,
  CHART_TYPE_FIXED_TEXT,
  CHART_TYPE_LINE,
  CHART_TYPE_MIXED,
} from '../../../configs/chartTypes'

import { getAllChartsRelatedToWhere } from '../../../configs/charts'


  const widgetTypes = {
    Row: [
      {type: 'Jobs', where: '*', i18n: 'general.veeam.jobs'},
      {type: 'BackupServers', where: '*', i18n: 'general.veeam.backupservers'},
      {type: 'Repositories', where: '*', i18n: 'general.veeam.repositories'}
    ],
    // Cols: {
    //   BackupServers: [],
    //   Jobs: [],
    //   Repositories: []
    // }
    Cols: [],
  }

const Widget = (props) => {

  const {removeItemFunc, item, editMode, t, itemIndex} = props

  const [itemCustomUUID] = React.useState(item.type+itemIndex+item.uid)

  const [itemRemoveEditUUID] = React.useState(item.type+'_'+item.uid)

  const [busyOnFetch, setBusyOnfetch] = React.useState(false)
  const [err, setErr] = React.useState(false)
  const [chartInfo, setChartInfo] = React.useState(null)
  const [chartPoints, setChartPoints] = React.useState(null)
  const [busyOnData, setBusyOnData] = React.useState(false)


  // Init Chart
  React.useEffect(() => {
    setBusyOnfetch(true)
    GetWidgetInfo(itemCustomUUID).then(data => {
      if (data.hasOwnProperty('error') && data.error === true) {
        if(item.hasOwnProperty('chartData')) {
          setErr(false)
          setChartInfo(item.chartData)

          // console.log(item.chartData);
        } else {
          setErr(true)
          setChartInfo(null)
        }
      } else {
        setChartInfo(data)
        setErr(false)
      }
      setBusyOnfetch(false)
    })
  }, [itemCustomUUID, item])



  // Init Rows
  React.useEffect(() => {
    widgetTypes.Cols = []
    let widgetRows = getRows()

    if (widgetRows.BackupServers.length > 0) {
      widgetTypes.Cols.push(widgetRows.BackupServers.map((item) => {
        return { type: 'BackupServers', uid: item.UID, name: item.Name, i18n: 'general.veeam.backupserver' }
      }))
    }

    if (widgetRows.Jobs.length > 0) {
      widgetTypes.Cols.push(widgetRows.Jobs.map((item) => {
        return { type: 'Jobs', uid: item.UID, name: item.Name, i18n: 'general.veeam.job' }
      }))
    }

    if (widgetRows.Repositories.length > 0) {
      widgetTypes.Cols.push(widgetRows.Repositories.map((item) => {
        return { type: 'Repositories', uid: item.UID, name: item.Name, i18n: 'general.veeam.repository' }
      }))
    }

  }, [])


  React.useEffect(() => {
    if (chartInfo !== null && chartInfo !== undefined) {
      let obj = getAllChartsRelatedToWhere(chartInfo.ChartData.where.type)
      let wantedObj = undefined
      obj.forEach((e, index) => {
        if (e.type === chartInfo.ChartData.chart.Type) {
          wantedObj = e
        }
      })
      if (wantedObj !== undefined) {
        if (wantedObj.cbFunc !== undefined) {
          setBusyOnData(true)
          wantedObj.cbFunc(chartInfo.ChartData).then(resultPoints => {
            if (resultPoints.hasOwnProperty('error') && resultPoints.error === true) {
              alert('error', resultPoints)
            } else {
              setChartPoints({...resultPoints})
              // setChartPoints({stat: data.stat})
            }
            setBusyOnData(false)
          })
        }

      }
    }
  }, [chartInfo])

  React.useEffect(() => {
    // console.log(chartPoints);
  }, [chartPoints])



  const DefaultWithNoData = () => (
    <div >
      {
        !editMode ?
          ''
        :
          <div>
            <button className="btn btn-danger btn-secondary pull-right btn-sm ml-1" style={{float: "right"}}
              onClick={removeItemFunc.bind(this, item.uid)}
            >x</button>
            {
              item.saved ?
              <Link to={{
                  pathname : `/widget/edit/${item.uid}`,
                  state: {
                    dashboard: props.dashboard,
                    widgetTypes: widgetTypes,
                    item: {...item, index: itemIndex}
                  }
                }} className="btn btn-warning btn-sm pull-right mr-2" style={{float: "right"}} >
                <i className='fas fa-poll mr-2'></i>
                {t('general.btn.edit')}
              </Link>
              :
              ''
            }


          </div>
      }

      <h6>{'{Title}'}</h6>

    </div>
  )



  const ShowChart = () => {
    if (chartInfo !== null && chartInfo !== undefined){
      switch (chartInfo.ChartData.type) {
        case CHART_TYPE_SINGLE_STAT.type:
          // console.log(chartInfo.ChartData);
          // eslint-disable-next-line
          return <CHART_TYPE_SINGLE_STAT.component cssClasses={chartInfo.ChartData.cssClasses}
              preText={chartInfo.ChartData.chartPayload.preText} postText={chartInfo.ChartData.chartPayload.postText}
              chartPayload= {{...chartInfo.ChartData.chartPayload}}
              chartPoints={chartPoints || {}}
              item={{...item, index: itemIndex}}
              busyOnData={busyOnData}
              busy={busyOnFetch}
              title={chartInfo.Title}
              insideEditMode={false}
              editMode={editMode}
              hasError={err}
              itemUID={itemCustomUUID}
              removeEditUUID={itemRemoveEditUUID}
              removePanelFunc={removeItemFunc}
              itemSaved={item.saved}
              dashboard={props.dashboard}
              widgetTypes={widgetTypes}
              itemIndex={itemIndex}
              needForEditChartData={{...chartInfo.ChartData}}
            />
        case CHART_TYPE_FIXED_TEXT.type:
          // eslint-disable-next-line
          return <CHART_TYPE_FIXED_TEXT.component cssClasses={chartInfo.ChartData.cssClasses}
              preText={chartInfo.ChartData.chartPayload.preText} postText={chartInfo.ChartData.chartPayload.postText}
              chartPayload= {{...chartInfo.ChartData.chartPayload}}
              chartPoints={chartPoints || {}}
              item={{...item, index: itemIndex}}
              busyOnData={busyOnData}
              busy={busyOnFetch}
              title={chartInfo.Title}
              insideEditMode={false}
              editMode={editMode}
              hasError={err}
              itemUID={itemCustomUUID}
              removeEditUUID={itemRemoveEditUUID}
              removePanelFunc={removeItemFunc}
              itemSaved={item.saved}
              dashboard={props.dashboard}
              widgetTypes={widgetTypes}
              itemIndex={itemIndex}
              needForEditChartData={{...chartInfo.ChartData}}
            />

          case CHART_TYPE_LINE.type:
            // eslint-disable-next-line
            return <CHART_TYPE_LINE.component cssClasses={chartInfo.ChartData.cssClasses}
                preText={chartInfo.ChartData.chartPayload.preText} postText={chartInfo.ChartData.chartPayload.postText}
                chartPayload= {{...chartInfo.ChartData.chartPayload}}
                chartPoints={chartPoints}
                item={{...item, index: itemIndex}}
                busyOnData={busyOnData}
                busy={busyOnFetch}
                title={chartInfo.Title}
                insideEditMode={false}
                editMode={editMode}
                hasError={err}
                itemUID={itemCustomUUID}
                removeEditUUID={itemRemoveEditUUID}
                removePanelFunc={removeItemFunc}
                itemSaved={item.saved}
                dashboard={props.dashboard}
                widgetTypes={widgetTypes}
                itemIndex={itemIndex}
                needForEditChartData={{...chartInfo.ChartData}}
              />


          case CHART_TYPE_MIXED.type:
            // eslint-disable-next-line
            return <CHART_TYPE_MIXED.component cssClasses={chartInfo.ChartData.cssClasses}
                preText={chartInfo.ChartData.chartPayload.preText} postText={chartInfo.ChartData.chartPayload.postText}
                chartPayload= {{...chartInfo.ChartData.chartPayload}}
                chartPoints={chartPoints}
                item={{...item, index: itemIndex}}
                busyOnData={busyOnData}
                busy={busyOnFetch}
                title={chartInfo.Title}
                insideEditMode={false}
                editMode={editMode}
                hasError={err}
                itemUID={itemCustomUUID}
                removeEditUUID={itemRemoveEditUUID}
                removePanelFunc={removeItemFunc}
                itemSaved={item.saved}
                dashboard={props.dashboard}
                widgetTypes={widgetTypes}
                itemIndex={itemIndex}
                needForEditChartData={{...chartInfo.ChartData}}
              />

        default:
          return <DefaultWithNoData />
      }
    }
    return <DefaultWithNoData />
  }

  return (
    <ShowChart />
  )



}


export default withTranslation()(Widget)
