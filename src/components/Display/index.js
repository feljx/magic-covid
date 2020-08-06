import Chart from 'chart.js'
import 'chartjs-plugin-colorschemes'
import { useRef, useEffect, useState } from 'react'

import styles from './index.module.css'
import { tuples, format_date } from '../../shared'
import { query_api } from '../../data/api_query'

function Display ({ geoCodes }) {
    //
    // State
    //

    const [ geoData, setGeoData ] = useState({})

    //
    // Handlers
    //

    function updateGeoData (data) {
        const newGeoData = { ...geoData, ...data }
        setGeoData(newGeoData)
    }

    //
    // Data fetching
    //

    useEffect(
        () => {
            if (geoCodes.length < 1) return
            const queryCodes = geoCodes
                .filter((geoCode) => !geoData[geoCode])
                .map((s) => s.toUpperCase())
            if (queryCodes.length < 1) return

            const queryString = `geo=${queryCodes.join(',')}`
            query_api('datapoints', queryString).then((res) => {
                const consObj = (a, [ k, v ]) => ((a[k] = v) || true) && a
                const data = Object.entries(res.data).reduce(consObj, {})
                updateGeoData(data)
            })
        },
        [ geoCodes ]
    )

    //
    // Chart construction
    //

    const canvasRef = useRef(null)
    useEffect(
        () => {
            // Prepare data
            const _labels = []
            const dataCases = {}
            const dataDeaths = {}
            for (const rows of Object.values(geoData)) {
                for (const r of rows) {
                    const date = format_date(new Date(r.time))
                    _labels.push(date)
                    if (!dataCases[date]) {
                        dataCases[date] = { [r.geo_code]: r.cases }
                    } else {
                        dataCases[date][r.geo_code] = r.cases
                    }
                    if (!dataDeaths[date]) {
                        dataDeaths[date] = { [r.geo_code]: r.deaths }
                    } else {
                        dataDeaths[date][r.geo_code] = r.deaths
                    }
                }
            }
            const labels = [ ...new Set(_labels) ].sort().map((dateString) => {
                const time = new Date(dateString)
                const [ mm, dd ] = [ time.getMonth(), time.getDate() ]
                const label = `${MONTHS[mm]} ${dd}`
                return label
            })
            const datasets = Object.keys(geoData).map((geoCode) => {
                const dates = Object.keys(dataCases).sort()
                const data = dates.map(
                    (dateString) => dataCases[dateString][geoCode] || null
                )
                return {
                    label: geoCode,
                    data,
                }
            })

            console.log(dataCases)
            console.log(datasets)

            // Draw chart
            const ctx = canvasRef.current.getContext('2d')
            for (const dataset of datasets) {
                const chart = new Chart(ctx, {
                    type: 'bar',
                    data: {
                        labels,
                        datasets: [ dataset ],
                    },
                    options: {
                        legend: { display: true },
                        plugins: {
                            colorschemes: {
                                scheme: 'brewer.DarkTwo8',
                            },
                        },
                    },
                })
            }
        },
        [ geoData ]
    )

    /*
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

        const ctx = canvasRef.current.getContext('2d')
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
    */

    return (
        <div className={styles.container}>
            <canvas ref={canvasRef} />
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
