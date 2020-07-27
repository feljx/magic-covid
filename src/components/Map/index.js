import styles from './index.module.css'
import { useEffect, useState } from 'react'
import { Chart as GChart } from 'react-google-charts'
import { query_api } from '../../data/api_query'
import { eachDayOfInterval } from 'date-fns'
import { debounce, format_date, round_two_digits, tuples } from '../../shared'

const all_days = tuples(
    7,
    eachDayOfInterval({
        start: new Date(2019, 12, 31),
        end: new Date(),
    }).map(format_date)
)

function Map () {
    const [ chart_data, set_chart_data ] = useState(null)
    const [ slider_index, set_slider_index ] = useState(all_days.length - 1)
    const slider_week = all_days[slider_index]
    const [ start, end ] = [
        slider_week[0],
        slider_week[slider_week.length - 1],
    ]

    const update_slider = (ev) => {
        set_slider_index(ev.target.value)
    }

    const preparedData = !!chart_data && [
        [ 'Countries', 'Cases / 100k' ],
        ...chart_data.countries.map((row) => [
            row.geo_code,
            !!row.pop
                ? round_two_digits(
                      row.cases / (Number(row.pop) / 100000) / row.daycount
                  )
                : null,
        ]),
    ]

    useEffect(
        () => {
            const params = `worldmap?start=${start}&end=${end}`
            query_api(params).then(set_chart_data)
        },
        [ slider_week ]
    )

    return !!chart_data ? (
        <div className={styles.container}>
            <div>
                Week from {start} to {end}
            </div>
            <input
                className={styles.slider}
                type="range"
                min="0"
                max={all_days.length - 1}
                step="1"
                value={slider_index}
                onChange={update_slider}
            />
            <GChart
                mapsApiKey={'AIzaSyAAYhsRZFxLK7EwtE2isGGNk12bvm_2KBM'}
                chartEvents={[
                    {
                        eventName: 'select',
                        callback: ({ chartWrapper }) => {
                            const chart = chartWrapper.getChart()
                            const selection = chart_data.getSelection()
                            if (selection.length === 0) return
                            const region = chart_data[selection[0].row + 1]
                            console.log('Selected : ' + region)
                        },
                    },
                ]}
                chartType="GeoChart"
                // width="100%"
                // height="400px"
                data={preparedData}
                options={{
                    backgroundColor: 'transparent',
                    colorAxis: {
                        minValue: 0,
                        maxValue: 20,
                        colors: [ 'green', 'yellow', 'red' ],
                    },
                }}
            />
        </div>
    ) : (
        <div>Loading</div>
    )
}

export default Map
