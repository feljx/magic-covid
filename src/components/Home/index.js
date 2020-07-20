import styles from './Home.module.css'
import { use_state, use_global_state } from '../../state'
import { useEffect } from 'react'

function Home () {
	const [ input_val, set_input_val ] = use_state('')
	const update_input_val = function (ev) {
		set_input_val(ev.target.value)
	}
	// const global_state = use_global_state()[0]
	// useEffect(function () {
	// 	console.log(global_state.countries)
	// })
	return (
		<input
			type="text"
			value={input_val}
			onChange={update_input_val}
			className={styles.search}
		/>
	)
}

export default Home
