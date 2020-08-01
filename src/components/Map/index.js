import styles from './index.module.css'
import { useEffect, useState } from 'react'
import { query_api } from '../../data/api_query'
import { eachDayOfInterval, parseISO, sub, add, format } from 'date-fns'
import { debounce, format_date, round_two_digits, tuples } from '../../shared'
import Svg from './Svg'

// Constants
const VIEWBOX_BASE = [ 30.767, 241.591, 784.077, 458.627 ]
const VIEWBOX_ZOOM = [
    30.767 + 196.01925,
    241.591 + 114.65675 - 70,
    392.0385,
    229.3135
]
const TOOLTIP_HIDDEN = { display: 'none' }
const TOOLTIP_VISIBLE = (ev) => ({
    display: 'block',
    top: `${ev.clientY + 15}px`,
    left: `${ev.clientX + 15}px`
})

function Map () {
    // State
    const [ tooltip_content, set_tooltip_content ] = useState('')
    const [ tooltip_styles, set_tooltip_styles ] = useState({})

    // Event handlers
    const print_code = (ev) => {
        const region = ev.target.closest('[id]')
        region.style.fill = 'red'
        const id = region.getAttribute('id')
        // console.log('Client:', ev.clientX, ev.clientY)
    }
    const debounced_set_tooltip_content = debounce(set_tooltip_content)
    const debounced_set_tooltip_styles = debounce(set_tooltip_styles)
    const show_toolip = (ev) => {
        const region = ev.target.closest('[id]')
        const id = region.getAttribute('id')
        const on_country = id !== 'world-map'
        if (on_country) debounced_set_tooltip_content(id)
        const styles = on_country ? TOOLTIP_VISIBLE(ev) : TOOLTIP_HIDDEN
        debounced_set_tooltip_styles(styles)
    }

    // Render
    return (
        <div className={styles.container}>
            <div className={styles.map_container}>
                <Svg
                    // viewBox={VIEWBOX.join(' ')}
                    className={styles.map}
                    onClick={print_code}
                    onMouseMove={show_toolip}
                />
            </div>
            <div className={styles.tooltip} style={tooltip_styles}>
                {tooltip_content}
            </div>
        </div>
    )
}

export default Map
