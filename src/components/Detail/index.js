import styles from './index.module.css'
import { use_global_state } from '../../state'
import Chart from 'chart.js'
import { useRef, useEffect } from 'react'
import Title from '../Title'

function tuples (size, list) {
    const n = Math.floor(list.length / size)
    const rest = list.slice(n * size)
    const tuple_list = new Array(n).fill(null).map(function (_, idx) {
        const idx_norm = idx * size
        return new Array(size).fill(null).map((_, idx) => list[idx_norm + idx])
    })
    if (rest.length > 0) tuple_list.push(rest)
    return tuple_list
}

function Detail ({ data }) {
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
            const [ yyyy, mm, dd ] = [
                time.getFullYear(),
                time.getMonth(),
                time.getDate(),
            ]
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

export default Detail

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
