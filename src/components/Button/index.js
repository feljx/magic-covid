import styles from './index.module.css'
import Search from '../Search'
import Title from '../Title'

const [ SEARCH, MAP ] = [ true, false ]

//
// React Component
//

function Home (props) {
    const [ mode, setMode ] = useState(SEARCH)

    return (
        <div className={styles.container}>
            <Title />
            <
            {mode === SEARCH ? <Search /> : <Map />}
        </div>
    )
}

export default Home
