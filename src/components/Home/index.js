import styles from './index.module.css'
import Search from '../Search'
import Title from '../Title'

function Home ({ continents, countries }) {
    return (
        <div className={styles.container}>
            <Title />
            <Search countries={countries} />
        </div>
    )
}

export default Home
