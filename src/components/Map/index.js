import styles from './index.module.css'
import { useEffect, useState, createRef } from 'react'
import { query_api } from '../../data/api_query'
import { eachDayOfInterval, parseISO, sub, add, format } from 'date-fns'
import {
    debounce,
    format_date,
    round_two_digits,
    tuples,
    debounce_ev,
} from '../../shared'
import Svg from './Svg'

// Constants
const VIEWBOX_BASE = [ 30.767, 241.591, 784.077, 458.627 ]
const VIEWBOX_ZOOM = [
    30.767 + 196.01925,
    241.591 + 114.65675 - 70,
    392.0385,
    229.3135,
]
const TOOLTIP_HIDDEN = { display: 'none' }
const TOOLTIP_VISIBLE = (ev) => ({
    display: 'block',
    top: `${ev.clientY + 15}px`,
    left: `${ev.clientX + 15}px`,
})

const all_days = eachDayOfInterval(
    {
        start: parseISO('2019-12-31'),
        end: new Date(),
    },
    { step: 2 }
).map(format_date)

const last_day = all_days[all_days.length - 1]
const today = format_date(new Date())
if (last_day !== today) {
    all_days.push(today)
}

function Map () {
    const svg_ref = createRef()

    //
    // State
    //
    const [ tooltip_content, set_tooltip_content ] = useState('')
    const [ tooltip_styles, set_tooltip_style ] = useState({})
    const [ slider_index, set_slider_index ] = useState(all_days.length - 1)
    const selected_date = all_days[slider_index]

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
            const end = add(parseISO(selected_date), {
                days: 1,
            })
            const start = sub(end, { days: 14 })
            const params = `worldmap?start=${format_date(
                start
            )}&end=${format_date(end)}`
            query_api(params).then((res) => {
                for (const row of res.data) {
                }
            })
        },
        [ selected_date ]
    )

    const localized_date = format(parseISO(selected_date), 'PP')

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
                  left: `${client_x + 15}px`,
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
            <div className={styles.map_container}>
                <Svg
                    // ref={svg_ref}
                    // viewBox={VIEWBOX.join(' ')}
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
