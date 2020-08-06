import { useState } from 'react'
import Link from 'next/link'

import styles from './index.module.css'

//
// Search
//

function Search ({ items, updateDisplayed }) {
    // State
    const EMPTY = ''
    const [ input, setInput ] = useState(EMPTY)
    const [ selected, setSelected ] = useState([])
    const forInput = (item) =>
        item.name.toLowerCase().includes(input.toLowerCase())
    const listItems =
        input === EMPTY ? selected : items.filter(forInput).slice(0, 10)

    // Event Handlers
    const updateInput = (ev) => {
        setInput(ev.target.value)
    }

    const updateSelected = (item) => () => {
        if (!selected.includes(item)) {
            const newItems = [ ...selected, item ]
            setSelected(newItems)
            updateDisplayed(newItems)
        }
        setInput(EMPTY)
    }

    const removeSelected = (item) => () => {
        if (selected.includes(item)) {
            const newItems = selected.filter((_item) => _item !== item)
            setSelected(newItems)
            updateDisplayed(newItems)
        }
    }

    // Render
    return (
        <div className={styles.search}>
            <Field updateInput={updateInput}>{input}</Field>
            <List
                showSelected={input === EMPTY}
                updateSelected={updateSelected}
                removeSelected={removeSelected}
            >
                {listItems}
            </List>
        </div>
    )
}

//
// Search Field
//

function Field ({ children, updateInput }) {
    return (
        <input
            className={styles.field}
            type="text"
            value={children}
            onChange={updateInput}
            placeholder="Country or continent"
        />
    )
}

//
// Search List
//

function List ({ children, showSelected, updateSelected, removeSelected }) {
    const listMode = showSelected ? styles.list_item_selected : styles.list_item

    function ListItem ({ data }) {
        return (
            <li
                className={listMode}
                onClick={showSelected ? null : updateSelected(data)}
            >
                {data.name}
                {showSelected && (
                    <span
                        className={styles.list_item_selected_x}
                        onClick={removeSelected(data)}
                    >
                        x
                    </span>
                )}
            </li>
        )
    }

    return (
        <ul className={styles.list}>
            {children.map((item) => (
                <ListItem key={item.geo_code} data={item} />
            ))}
        </ul>
    )
}

/* <Link
    href={'/[geo_code]'}
    as={`/${country.geo_code}`}
    key={country.geo_code}
    > */
//     </Link>

export default Search
