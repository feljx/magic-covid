import Link from 'next/link'
import styles from './index.module.css'
import { use_state, use_global_state } from '../../state'

export default function Search (props) {
	const [ input_val, set_input_val ] = use_state('')
	const update_input_val = function (ev) {
		set_input_val(ev.target.value)
	}
	const [ s ] = use_global_state()
	const cache_loaded = !!s.cache.countries
	return cache_loaded ? (
		<div className={`${props.className} ${styles.search}`}>
			<input
				className={styles.field}
				type="text"
				value={input_val}
				onChange={update_input_val}
				placeholder="Enter country or territory"
			/>
			<ul className={styles.list}>
				{s.cache.countries
					.filter((country) =>
						country.toLowerCase().includes(input_val.toLowerCase())
					)
					.map((country) => (
						<Link href={`/${country}`} key={country}>
							<li className={styles.list_item}>{country}</li>
						</Link>
					))}
			</ul>
		</div>
	) : (
		'Loading...'
	)
}
