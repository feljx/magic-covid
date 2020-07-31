import styles from './index.module.css'
import { useEffect, useState } from 'react'
import { query_api } from '../../data/api_query'
import { eachDayOfInterval, parseISO, sub, add, format } from 'date-fns'
import { debounce, format_date, round_two_digits, tuples } from '../../shared'
import Svg from './Svg'

const VIEWBOX_BASE = [ 30.767, 241.591, 784.077, 458.627 ]
const VIEWBOX_ZOOM = [
    30.767 + 196.01925,
    241.591 + 114.65675 - 70,
    392.0385,
    229.3135,
]

function Map () {
    const print_code = (ev) => {
        const region = ev.target.closest('[id]')
        region.style.fill = 'red'
        const id = region.getAttribute('id')
        console.log(id)

        console.log('Client:', ev.clientX, ev.clientY)
    }
    return (
        <div className={styles.container}>
            <div className={styles.map_container}>
                <Svg
                    // viewBox={VIEWBOX.join(' ')}
                    className={styles.map}
                    onClick={print_code}
                />
            </div>
        </div>
    )
}

export default Map
