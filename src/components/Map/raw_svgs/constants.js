import { eachDayOfInterval, parseISO, isSameDay } from 'date-fns'

import territories from '../svg_map.json'
import { get_color_fn } from '../../../shared'

// Constants
export const VIEWBOX_BASE = [ 30.767, 241.591, 784.077, 458.627 ]
export const VIEWBOX_ZOOM = [
    30.767 + 196.01925,
    241.591 + 114.65675 - 70,
    392.0385,
    229.3135
]

// Color
export const COLOR_MIN = [ 193, 214, 232 ]
export const COLOR_MAX = [ 224, 0, 37 ]
export const get_color = get_color_fn(COLOR_MIN, COLOR_MAX)
export const [ MIN, MAX ] = [ 0, 25 ]

// Territories
export const TERRITORIES = territories
export const TERRITORIES_LIST = Object.keys(territories)

// Days
export const ALL_DAYS = eachDayOfInterval(
    {
        start: parseISO('2019-12-31'),
        end: new Date()
    },
    { step: 2 }
)
export const last_day = ALL_DAYS[ALL_DAYS.length - 1]
export const today = new Date()
export const today_not_included = !isSameDay(today, last_day)
if (today_not_included) ALL_DAYS.push(today)
