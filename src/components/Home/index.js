import { useState } from 'react'

import styles from './index.module.css'
import Title from '../Title'
import Search from '../Search'
import Map from '../Map'
import Display from '../Display'

//
// React Component
//

function Home ({ items }) {
    // State
    const [ SEARCH, MAP ] = [ 0, 1 ]
    const MODE_LABEL = [ 'Map', 'Search' ]
    const [ mode, setMode ] = useState(SEARCH)
    const [ displayedItems, setDisplayedItems ] = useState([])
    const displayedGeoCodes = displayedItems.map((item) => item.geo_code)

    // Event Handlers
    function updateMode (ev) {
        setMode(mode ^ 1)
    }

    function updateDisplayed (listOfDisplayedItems) {
        setDisplayedItems(listOfDisplayedItems)
    }

    // Render
    return (
        <div className={styles.container}>
            <Title />
            <Button onClick={updateMode}>{MODE_LABEL[mode]}</Button>
            {mode === SEARCH ? (
                <Search items={items} updateDisplayed={updateDisplayed} />
            ) : (
                <Map updateDisplayed={updateDisplayed} />
            )}
            <Display geoCodes={displayedGeoCodes} />
        </div>
    )
}

function Button ({ onClick, children }) {
    return <button onClick={onClick}>{children}</button>
}

export default Home
