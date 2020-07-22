import styles from './index.module.css'
import Search from '../Search'
import Title from '../Title'

function Home () {
	return (
		<div className={styles.container}>
			<Title />
			<Search />
		</div>
	)
}

export default Home
