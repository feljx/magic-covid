import styles from './index.module.css'
import Link from 'next/link'

export default function Title () {
	return (
		<Link href="/">
			<h1 className={styles.title}>
				<span>covid</span>
				<span>report</span>
			</h1>
		</Link>
	)
}
