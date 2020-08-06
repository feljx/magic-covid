import { useEffect, useState, useRef } from 'react'
import { sub, add, format } from 'date-fns'

import styles from './index.module.css'
import { query_api } from '../../data/api_query'
import { debounce, format_date, round_two_digits } from '../../shared'
import {
    ALL_DAYS,
    MID,
    MAX,
    TERRITORIES,
    TERRITORIES_LIST,
    get_color_lower,
    get_color_upper,
} from './constants'
import Tooltip from './Tooltip'
import SvgMap from './SvgMap'

//
// Map Component
//

function Map ({ updateDisplayed }) {
    const svg_ref = useRef(null)

    //
    // State
    //

    const [ tooltip_props, set_tooltip_props ] = useState('')
    const [ map_data, set_map_data ] = useState(null)
    const [ current_region, set_current_region ] = useState(null)
    const [ slider_index, set_slider_index ] = useState(ALL_DAYS.length - 1)
    const selected_date = ALL_DAYS[slider_index]
    const localized_date = format(selected_date, 'PP')

    //
    // Data querying and associated side effects
    //

    const _useEffect = debounce(() => {
        const end = add(selected_date, { days: 1 })
        const start = sub(end, { days: 14 })
        const query_string = [ [ 'end', end ], [ 'start', start ] ]
            .map(([ field, value ]) => `${field}=${format_date(value)}`)
            .join('&')

        query_api('worldmap', query_string).then((res) => {
            // Reset all region colors to white
            for (const id of TERRITORIES_LIST) {
                const region = svg_ref.current.getElementById(id)
                region && (region.style.fill = 'rgba(140, 140, 140)')
            }
            // Iterate through queried data
            const map_data = {}
            for (const row of res.data) {
                const id = row.geo_code.toLowerCase()
                const cases_per_100k = round_two_digits(
                    Number(row.cases) /
                        (Number(row.pop) / 100000) /
                        row.daycount
                )
                map_data[id] = { cases_per_100k, ...row }
                const region = svg_ref.current.getElementById(id)
                if (region) {
                    const no_pop_data = !row.pop
                    const zero_cases = Number(row.cases) === 0
                    const should_fill_color = !(no_pop_data || zero_cases)
                    if (should_fill_color) {
                        const lower_scale = cases_per_100k < MID
                        const cases_adjusted =
                            cases_per_100k - (!lower_scale ? MID : 0)
                        const divisor = lower_scale ? MID : MAX - MID
                        const color_fn =
                            cases_per_100k <= MID
                                ? get_color_lower
                                : get_color_upper
                        const color = color_fn(cases_adjusted / divisor).join(
                            ', '
                        )
                        region.style.fill = `rgb(${color})`
                    }
                }
            }
            // Fill Somaliland with Somalia's data
            const somalia = svg_ref.current.getElementById('so')
            const somaliland = svg_ref.current.getElementById('_somaliland')
            somaliland.style.fill = somalia.style.fill
            // Save data to state for later access
            set_map_data(map_data)
        })
    })

    useEffect(_useEffect, [ selected_date ])

    //
    // Event handlers
    //

    // Update slider
    const _update_slider = debounce(set_slider_index)
    const update_slider = (ev) => _update_slider(ev.target.value)

    // Color regions yellow on click
    const print_code = (ev) => {
        const region = ev.target.closest('[id]')
        region.style.fill = 'yellow'
        const id = region.getAttribute('id')
        updateDisplayed([ id ])
    }
    // Update tooltip when hovering over region
    const _change_tooltip = debounce((region, client_x, client_y) => {
        const id = region.getAttribute('id')
        const on_country = id !== 'world-map'
        const style = on_country
            ? {
                  display: 'block',
                  top: `${client_y + 15}px`,
                  left: `${client_x + 15}px`,
              }
            : { display: 'none' }
        if (current_region) {
            current_region.style.removeProperty('stroke')
            current_region.style.removeProperty('strokeWidth')
            current_region.style.removeProperty('transform')
        }
        if (on_country && map_data) {
            region.style.stroke = '#059e7a'
            region.style.strokeWidth = '2'
            region.style.filter = 'contrast(500%);'
            set_current_region(region)
            set_tooltip_props({
                name: TERRITORIES[id] || map_data[id].name,
                data: map_data[id],
                style,
            })
        } else set_tooltip_props({ style })
    })
    const change_tooltip = (ev) => {
        const region = ev.target.closest('[id]')
        _change_tooltip(region, ev.clientX, ev.clientY)
    }

    //
    // Rendering
    //

    return (
        <div className={styles.container}>
            <div>
                14 day moving average on <br /> {localized_date}
            </div>
            <input
                className={`styles.slider slider`}
                type="range"
                min="0"
                max={ALL_DAYS.length - 1}
                step="1"
                value={slider_index}
                onChange={update_slider}
            />
            <div className={styles.map_container}>
                <SvgMap
                    // viewBox={VIEWBOX.join(' ')}
                    ref={svg_ref}
                    className={styles.map}
                    onClick={print_code}
                    onMouseMove={change_tooltip}
                />
            </div>
            {<Tooltip {...tooltip_props} />}
        </div>
    )
}

export default Map
