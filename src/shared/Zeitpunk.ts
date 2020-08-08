//
// Types
//

type Zeit = number | Date

interface Zeitpunk {
    zeit: number
    gregorian: number[]
    repr: string
    verb: string
    plus: Zeitops
    minus: Zeitops
}

type Zeitop = (n: number) => Zeitpunk

interface Zeitops {
    weeks: Zeitop
    days: Zeitop
    hours: Zeitop
    minutes: Zeitop
    seconds: Zeitop
}

//
// Zeitpunk factory
//

export default function Zeitpunk (dateOrMs?: Zeit) {
    const zeit = dateOrMs instanceof Date ? dateOrMs.valueOf() : dateOrMs
    const gregorian = unixToDays(zeit)
    const [ sy, sm, sd ] = gregorian.map((n) => String(n).padStart(2, '0'))
    const repr = `${sy}-${sm}-${sd}`
    const verb = `${MONTHS_GREG[gregorian[1] - 1]} ${gregorian[2]}`
    const toZeitops = (op: boolean) => (a: any, [ k, v ]: any) =>
        ((a[k] = Zeitop(zeit, op, v)) || 1) && a
    const plus = Object.freeze(UNITS.reduce(toZeitops(PLUS), {}))
    const minus = Object.freeze(UNITS.reduce(toZeitops(MINUS), {}))
    const instance: Zeitpunk = Object.freeze({
        zeit,
        gregorian,
        repr,
        verb,
        plus,
        minus,
    })
    return instance
}

//
// Operations
//

function Zeitop (zeit, operator, factor) {
    const instance: Zeitop =
        operator === PLUS
            ? (n) => Zeitpunk(zeit + n * factor)
            : (n) => Zeitpunk(zeit - n * factor)
    return Object.freeze(instance)
}

//
// Helpers
//

function unixToDays (date: Zeit = new Date()): number[] {
    const ms =
        date instanceof Date
            ? date.valueOf() + date.getTimezoneOffset() * 60000
            : date + new Date().getTimezoneOffset() * 60000
    const z = BigInt(ms) / BigInt(86400000) + BigInt(719468)
    const era = (z >= 0 ? z : z - BigInt(146096)) / BigInt(146097)
    const doe = z - era * BigInt(146097)
    const yoe =
        (doe - doe / BigInt(1460) + doe / BigInt(36524) - doe / BigInt(146096)) /
        BigInt(365)
    const y = yoe + era * BigInt(400)
    const doy = doe - (BigInt(365) * yoe + yoe / BigInt(4) - yoe / BigInt(100))
    const mp = (BigInt(5) * doy + BigInt(2)) / BigInt(153)
    const d = doy - (BigInt(153) * mp + BigInt(2)) / BigInt(5) + BigInt(1)
    const m = mp + (mp < 10 ? BigInt(3) : BigInt(-9))
    return [ Number(y) + Number(m <= 2), Number(m), Number(d) ]
}

//
// Constants
//

const [ PLUS, MINUS ] = [ true, false ]
const UNITS = [
    [ 'weeks', 1000 * 60 * 60 * 24 * 7 ],
    [ 'days', 1000 * 60 * 60 * 24 ],
    [ 'hours', 1000 * 60 * 60 ],
    [ 'minutes', 1000 * 60 ],
    [ 'seconds', 1000 ],
]

const MONTHS_GREG = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
]

//

export function tuples (size, list) {
    const n = Math.floor(list.length / size)
    const rest = list.slice(n * size)
    const tuple_list = new Array(n).fill(null).map(function (_, idx) {
        const idx_norm = idx * size
        return new Array(size).fill(null).map((_, idx) => list[idx_norm + idx])
    })
    if (rest.length > 0) tuple_list.push(rest)
    return tuple_list
}

export function format_date (date) {
    const pad = (n) => String(n).padStart(2, '0')
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
}
