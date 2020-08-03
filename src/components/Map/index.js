import styles from './index.module.css'
import { useEffect, useState, createRef, useRef } from 'react'
import { query_api } from '../../data/api_query'
import {
    eachDayOfInterval,
    parseISO,
    sub,
    add,
    format,
    isSameDay
} from 'date-fns'
import {
    debounce,
    format_date,
    round_two_digits,
    tuples,
    debounce_ev,
    get_color_fn
} from '../../shared'
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

// Color
const [ color1, color2 ] = [ [ 121, 190, 217 ], [ 255, 0, 0 ] ]
const get_color = get_color_fn(color1, color2)

// DAYS
const all_days = eachDayOfInterval(
    {
        start: parseISO('2019-12-31'),
        end: new Date()
    },
    { step: 2 }
)
const last_day = all_days[all_days.length - 1]
const today = new Date()
const today_not_included = !isSameDay(today, last_day)
if (today_not_included) all_days.push(today)

//
// Component
//
function Map () {
    const svg_ref = useRef(null)

    //
    // State
    //
    const [ tooltip_content, set_tooltip_content ] = useState('')
    const [ tooltip_styles, set_tooltip_style ] = useState({})
    const [ slider_index, set_slider_index ] = useState(all_days.length - 1)
    const selected_date = all_days[slider_index]
    const localized_date = format(selected_date, 'PP')

    // Debounced helper function
    const _update_slider = debounce(set_slider_index)
    const update_slider = (ev) => _update_slider(ev.target.value)

    // const preparedData = !!chart_data && [
    //     [ 'Countries', 'Cases / 100k' ],
    //     ...chart_data.countries.map((row) => [
    //         { v: row.geo_code, f: row.name },
    //         !row.pop || Number(row.cases) === 0
    //             ? null
    //             : round_two_digits(
    //                   Number(row.cases) /
    //                       (Number(row.pop) / 100000) /
    //                       row.daycount
    //               ),
    //     ]),
    // ]

    useEffect(
        () => {
            const end = add(selected_date, { days: 1 })
            const start = sub(end, { days: 14 })
            const query_string = [ [ 'end', end ], [ 'start', start ] ]
                .map(([ field, value ]) => `${field}=${format_date(value)}`)
                .join('&')

            query_api('worldmap', query_string).then((res) => {
                for (const row of res.data) {
                    const id = row.geo_code.toLowerCase()
                    const region = svg_ref.current.getElementById(id)
                    region && (region.style.fill = 'green')
                }
                const somalia = svg_ref.current.getElementById('so')
                const somaliland = svg_ref.current.getElementById('_somaliland')
                somaliland.style.fill = somalia.style.fill
            })
        },
        [ selected_date ]
    )

    //
    // Event handlers
    //
    // Color regions red on click
    const print_code = (ev) => {
        const region = ev.target.closest('[id]')
        region.style.fill = 'red'
        const id = region.getAttribute('id')
    }
    // Debounced helper function
    const _change_tooltip = debounce((id, client_x, client_y) => {
        const on_country = id !== 'world-map'
        if (on_country) set_tooltip_content(id)
        const style = on_country
            ? {
                  display: 'block',
                  top: `${client_y + 15}px`,
                  left: `${client_x + 15}px`
              }
            : { display: 'none' }
        set_tooltip_style(style)
    })
    // Show and update tooltip when hovering over region, hide
    const change_tooltip = (ev) => {
        const region = ev.target.closest('[id]')
        const id = region.getAttribute('id')
        _change_tooltip(id, ev.clientX, ev.clientY)
    }

    //
    // Render
    //
    return (
        <div className={styles.container}>
            <div>
                14 day moving average on <br /> {localized_date}
            </div>
            <input
                className={styles.slider}
                type="range"
                min="0"
                max={all_days.length - 1}
                step="1"
                value={slider_index}
                onChange={update_slider}
            />
            <div className={styles.map_container}>
                <Svg
                    // viewBox={VIEWBOX.join(' ')}
                    ref={svg_ref}
                    className={styles.map}
                    onClick={print_code}
                    onMouseMove={change_tooltip}
                />
            </div>
            <div className={styles.tooltip} style={tooltip_styles}>
                {tooltip_content}
            </div>
        </div>
    )
}

export default Map
