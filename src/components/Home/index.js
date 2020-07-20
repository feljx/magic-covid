import styles from './Home.module.css'
import { use_state, use_global_state } from '../../state'
import { useEffect } from 'react'

function Home () {
	const [ input_val, set_input_val ] = use_state('')
	const update_input_val = function (ev) {
		set_input_val(ev.target.value)
	}
	const [ s ] = use_global_state()
	const cache_loaded = !!s.cache.countries
	return cache_loaded ? (
		<React.Fragment>
			<input
				type="text"
				value={input_val}
				onChange={update_input_val}
				className={styles.search}
			/>
			<ul>
				{s.cache.countries
					.filter((country) =>
						[ ...input_val.toLowerCase() ].every((c) =>
							country.toLowerCase().includes(c)
						)
					)
					.map((country) => <li key={country}>{country}</li>)}
			</ul>
		</React.Fragment>
	) : (
		'Loading...'
	)
}

export default Home
