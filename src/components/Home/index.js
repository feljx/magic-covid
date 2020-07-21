import styles from './index.module.css'
import { use_state, use_global_state } from '../../state'
import Search from '../Search'

function Home () {
	return (
		<div className={styles.container}>
			<h1 className={styles.title}>
				<span>covid</span>
				<span>report</span>
			</h1>
			<Search className={styles.content} />
		</div>
	)
}

export default Home
