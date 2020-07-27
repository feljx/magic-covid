export function debounce (
    func,
    wait = 0,
    { leading = false, trailing = true } = {}
) {
    const name = `debounce(${func.name})`
    let timer
    const debounced = {
        [name]: (...args) => {
            if (!wait) {
                return func(...args)
            }
            const callNow = leading && !timer
            cancel()
            timer = setTimeout(() => {
                timer = null
                if (trailing) {
                    return func(...args)
                }
            }, wait)
            if (callNow) {
                return func(...args)
            }
        },
    }[name]

    /**
	 * Cancels delayed `func` invocations.
	 */
    function cancel () {
        clearTimeout(timer)
    }

    return [ debounced, cancel ]
}

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

export function round_two_digits (num) {
    // @ts-ignore
    return +(Math.round(num + 'e+2') + 'e-2')
}

export function format_date (date) {
    const pad = (n) => String(n).padStart(2, '0')
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
        date.getDate()
    )}`
}
