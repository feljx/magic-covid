import styles from './index.module.css'
import { use_global_state } from '../../state'
import Chart from 'chart.js'
import { useRef, useEffect, useState } from 'react'
import Title from '../Title'
import { tuples } from '../../shared'

function Display ({ geoCodes }) {
    //
    // State
    //

    const [ geoData, setGeoData ] = useState(null)

    //
    // Data fetching
    //

    useEffect(() => {
        const queryString = geoCodes.join(',')
        query_api('datapoints', queryString).then((res) => {
            const consObj = (a, [ k, v ]) => ((a[k] = v) || true) && a
            const data = Object.entries(res.data).reduce(consObj, {})
            setGeoData(data)
        })
    }, [])

    const canvas_ref = useRef(null)

    useEffect(function () {
        const averaging_scope = 3
        const data_labels = []
        const data_cases = []
        const data_deaths = []
        const data_tuples = tuples(averaging_scope, data)
        for (const t of data_tuples) {
            const median = Math.floor(t.length / 2)
            const time = new Date(t[median].time)
            const [ mm, dd ] = [ time.getMonth(), time.getDate() ]
            const label = `${MONTHS[mm]} ${dd}`
            const sum = (key) => (acc, data) => acc + data[key]
            const cases = Math.round(t.reduce(sum('cases'), 0) / t.length)
            const deaths = Math.round(t.reduce(sum('deaths'), 0) / t.length)
            data_labels.push(label)
            data_cases.push(cases)
            data_deaths.push(deaths)
        }

        const ctx = canvas_ref.current.getContext('2d')
        const chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: data_labels,
                datasets: [
                    {
                        label: 'Cases',
                        borderColor: 'rgb(142, 185, 222)',
                        data: data_cases,
                    },
                    {
                        label: 'Deaths',
                        borderColor: 'rgb(212, 58, 79)',
                        data: data_deaths,
                    },
                ],
            },
            options: {
                legend: { display: true },
            },
        })
    }, [])
    return (
        <div className={styles.container}>
            <Title />
            <canvas ref={canvas_ref} />
        </div>
    )
}

export default Display

const MONTHS = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
]
