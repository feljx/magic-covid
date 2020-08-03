import styles from './index.module.css'
import { useEffect, useState } from 'react'
import { Chart as GChart } from 'react-google-charts'
import { query_api } from '../../data/api_query'
import { eachDayOfInterval, parseISO, sub, add, format } from 'date-fns'
import { debounce, format_date, round_two_digits, tuples } from '../../shared'

const all_days = eachDayOfInterval(
    {
        start: parseISO('2019-12-31'),
        end: new Date()
    },
    { step: 2 }
).map(format_date)

const last_day = all_days[all_days.length - 1]
const today = format_date(new Date())
if (last_day !== today) {
    all_days.push(today)
}

const chartEvents = [
    {
        eventName: 'select',
        callback ({ chartWrapper }) {
            console.log('Selected ', chartWrapper.getChart().getSelection())
        }
    }
]

function Map () {
    const [ chart_data, set_chart_data ] = useState(null)
    const [ slider_index, set_slider_index ] = useState(all_days.length - 1)
    const selected_date = all_days[slider_index]

    const debounced_set_slider_index = debounce(
        (new_index) => void set_slider_index(new_index)
    )
    const update_slider = (ev) =>
        void debounced_set_slider_index(ev.target.value)

    const preparedData = !!chart_data && [
        [ 'Countries', 'Cases / 100k' ],
        ...chart_data.countries.map((row) => [
            { v: row.geo_code, f: row.name },
            !row.pop || Number(row.cases) === 0
                ? null
                : round_two_digits(
                      Number(row.cases) /
                          (Number(row.pop) / 100000) /
                          row.daycount
                  )
        ])
    ]

    useEffect(
        () => {
            const end = add(parseISO(selected_date), {
                days: 1
            })

            const start = sub(end, { days: 14 })
            const params = `worldmap?start=${format_date(
                start
            )}&end=${format_date(end)}`
            query_api(params).then(set_chart_data)
        },
        [ selected_date ]
    )

    const localized_date = format(parseISO(selected_date), 'PP')

    return !!chart_data ? (
        <div className={styles.container}>
            <div>
                14 day moving average on <br /> {localized_date}
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
                className={styles.map}
                mapsApiKey={'AIzaSyAAYhsRZFxLK7EwtE2isGGNk12bvm_2KBM'}
                chartEvents={[
                    {
                        eventName: 'select',
                        callback: ({ chartWrapper }) => {
                            const chart = chartWrapper.getChart()
                            const selection = chart.getSelection()
                            if (selection.length === 0) return
                            const region = selection[0].row
                            const selected_data = preparedData[region + 1]
                            console.log('Selected:', selected_data)
                        }
                    }
                ]}
                chartType="GeoChart"
                data={preparedData}
                options={{
                    chartArea: {
                        left: '30%',
                        top: '30%',
                        width: '100%',
                        height: '100%'
                    },
                    legend: 'none',
                    backgroundColor: 'transparent',
                    defaultColor: '#F5F5F5',
                    colorAxis: {
                        minValue: 0,
                        maxValue: 20,
                        colors: [ '#79bed9', '#ff0000' ]
                    }
                }}
            />
        </div>
    ) : (
        <div>Loading</div>
    )
}

export default Map
