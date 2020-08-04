import Link from 'next/link'
import styles from './index.module.css'
import { useState } from 'react'

//
// Search
//

function Search ({ items }) {
    // State
    const EMPTY = ''
    const [ input, setInput ] = useState(EMPTY)
    const [ selected, setSelected ] = useState([])
    const forInput = (item) => item.name.toLowerCase().includes(input.toLowerCase())
    const listItems = input === EMPTY ? selected : items.filter(forInput).slice(0, 10)

    // Event Handlers
    const updateInput = function (ev) {
        setInput(ev.target.value)
    }

    const updateSelected = function (ev) {
        setInput(ev.target.value)
    }

    // Render
    return (
        <div className={styles.search}>
            <Field onChange={updateInput}>{input}</Field>
            <List showSelected={input === EMPTY} updateSelected={updateSelected}>
                {listItems}
            </List>
        </div>
    )
}

//
// Search Field
//

function Field (props) {
    return (
        <input
            className={styles.field}
            type="text"
            value={children}
            onChange={update_input_val}
            placeholder="Country or continent"
        />
    )
}

//
// Search List
//

function List ({ children, showSelected, updateSelected }) {
    const listMode = showSelected ? styles.list_item_selected : styles.list_item

    function ListItem ({ name, geo_code }) {
        return (
            <li className={listMode} onClick={updateSelected} key={geo_code || name}>
                {name}
            </li>
        )
    }

    return <ul className={styles.list}>{children.map(ListItem)}</ul>
}

/* <Link
    href={'/[geo_code]'}
    as={`/${country.geo_code}`}
    key={country.geo_code}
    > */
//     </Link>
