import styles from './index.module.css'
import { use_global_state } from '../../state'
import Chart from 'chart.js'
import { useRef, useEffect } from 'react'
import Title from '../Title'

function Detail ({ data }) {
	const canvas_ref = useRef(null)
	console.log(data)
	useEffect(function () {
		const labels = []
		const cases = []
		const deaths = []
		for (const d of data) {
			const [ yyyy, mm, dd ] = d.time.split('-')
			labels.push(`${MONTHS[mm - 1]} ${dd}`)
			cases.push(d.cases)
			deaths.push(d.deaths)
		}
		const ctx = canvas_ref.current.getContext('2d')

		const chart = new Chart(ctx, {
			type: 'line',
			data: {
				labels,
				datasets: [
					{
						label: 'Cases',
						backgroundColor: 'rgb(237, 159, 197)',
						borderColor: 'rgb(237, 159, 197)',
						data: cases,
						fill: false,
					},
					{
						label: 'Deaths',
						backgroundColor: 'rgb(212, 58, 79)',
						borderColor: 'rgb(212, 58, 79)',
						data: deaths,
					},
				],
			},
			options: {
				legend: { display: true },
			},
		})
	})
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
