import { useState } from 'react'

import styles from './index.module.css'
import Title from '../Title'
import Search from '../Search'
import Map from '../Map'

//
// React Component
//

function Home ({ items }) {
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
            <Button onClick={updateMode}>{MODE_LABEL[mode]}</Button>
            {mode === SEARCH ? <Search items={items} /> : <Map />}
        </div>
    )
}

function Button ({ onClick, children }) {
    return <button onClick={onClick}>{children}</button>
}

export default Home
