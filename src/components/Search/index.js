import Link from 'next/link'
import styles from './index.module.css'
import { useState } from 'react'

export default function Search ({ countries }) {
    const [ input_val, set_input_val ] = useState('')
    const update_input_val = function (ev) {
        set_input_val(ev.target.value)
    }

    return (
        <div className={styles.search}>
            <input
                className={styles.field}
                type="text"
                value={input_val}
                onChange={update_input_val}
                placeholder="Filter for country or territory"
            />
            <ul className={styles.list}>
                {countries
                    .filter((country) =>
                        country.name
                            .toLowerCase()
                            .includes(input_val.toLowerCase())
                    )
                    .map((country) => (
                        <Link
                            href={'/[geo_code]'}
                            as={`/${country.geo_code}`}
                            key={country.geo_code}
                        >
                            <li className={styles.list_item}>{country.name}</li>
                        </Link>
                    ))}
            </ul>
        </div>
    )
}

// <div className={`${props.className} ${styles.search}`}>Loading...</div>
