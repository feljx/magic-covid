import styles from './index.module.css'

function Home (props) {
	const row_to_list_item = (r) => (
		<li key={r.name}>{r.name.split('_').join(' ')}</li>
	)
	const items = props.rows.map(row_to_list_item)
	return <ul className={styles.main}>{items}</ul>
}

export default Home
