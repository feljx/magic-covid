import styles from './index.module.css'
import { use_global_state } from '../../state'
import { useRef, useEffect, useState } from 'react'
import Title from '../Title'
import { Chart as GChart } from 'react-google-charts'
import Chart from 'chart.js'
import { query_api } from '../../data/api_query'
import { eachDayOfInterval } from 'date-fns'

function convertDate(date) {
  return `${date.getFullYear()}-${(date.getMonth() + 1)
    .toString()
    .padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`
}

function Map() {
  const [chartData, setChartData] = useState(null)
  const today = new Date()
  const allDays = eachDayOfInterval({ start: new Date(2019, 12, 31), end: today }).map(convertDate)
  const [sliderIndex, setSliderIndex] = useState(allDays.length - 1)
  const [sliderDate, setSliderDate] = useState(allDays[sliderIndex])

  console.log(chartData)

  useEffect(
    () => {
      async function queryData() {
        setChartData(await query_api(`worldmap?date=${sliderDate}`))
      }
      queryData()
    },
    [sliderDate]
  )

  const updateSlider = (ev) => {
    setSliderIndex(ev.target.value)
    setSliderDate(allDays[sliderIndex])
  }

  const preparedData = !!chartData && [
    ['Countries', 'Cases'],
    ...chartData.countries.map((row) => [row.geo_code, row.cases / row.pop])
  ]

  console.log(sliderDate)

  return !!chartData ? (
    <div className={styles.container}>
      <div>{sliderDate}</div>
      <input type="range" min="0" max={allDays.length - 1} step="1" value={sliderIndex} onChange={updateSlider} />
      <GChart
        chartEvents={[
          {
            eventName: 'select',
            callback: ({ chartWrapper }) => {
              const chart = chartWrapper.getChart()
              const selection = chartData.getSelection()
              if (selection.length === 0) return
              const region = chartData[selection[0].row + 1]
              console.log('Selected : ' + region)
            }
          }
        ]}
        chartType="GeoChart"
        width="100%"
        height="400px"
        data={preparedData}
        options={{
          colorAxis: {
            colors: ['green', 'yellow', 'red']
          }
        }}
      />
    </div>
  ) : (
    <div>Loading</div>
  )
}

export default Map
