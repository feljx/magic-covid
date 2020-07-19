import styles from './Home.module.css'
import { use_state } from '../../state'

function Home () {
	const [ input_val, set_input_val ] = use_state('')
	const update_input_val = function (ev) {
		set_input_val(ev.target.value)
	}
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
