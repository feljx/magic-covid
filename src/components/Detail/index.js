import styles from './index.module.css'
import { use_state } from '../../state'

function Home (props) {
	const [ input_val, set_input_val ] = use_state('')
	const fn = (ev) => {
		console.log(ev.target.value)
		set_input_val(ev.target.value)
	}
	return (
		<input
			type="text"
			value={input_val}
			onChange={fn}
			className={styles.search}
		/>
	)
}

export default Home
