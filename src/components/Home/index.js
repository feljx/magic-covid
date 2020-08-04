import styles from './index.module.css'
import Search from '../Search'
import Title from '../Title'

//
// React Component
//

function Home ({ continents, countries }) {
    // State
    const [ SEARCH, MAP ] = [ 0, 1 ]
    const MODE_LABEL = [ 'Map', 'Search' ]
    const [ mode, setMode ] = useState(SEARCH)

    // Event Handlers
    function updateMode (ev) {
        setMode(mode ^ 1)
    }

    // Render
    return (
        <div className={styles.container}>
            <Title />
            <Button onClick={MODE_LABEL[mode]}>{mode}</Button>
            {mode === SEARCH ? <Search data={[ continents, countries ]} /> : <Map />}
        </div>
    )
}

export default Home
