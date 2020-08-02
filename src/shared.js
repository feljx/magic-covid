export function debounce (fn) {
    // Setup a timer
    let timeout

    // Return a function to run debounced
    return function () {
        // Setup the arguments
        const context = this
        const args = arguments

        // If there's a timer, cancel it
        if (timeout) {
            window.cancelAnimationFrame(timeout)
        }

        // Setup the new requestAnimationFrame()
        timeout = window.requestAnimationFrame(function () {
            fn.apply(context, args)
        })
    }
}

export function debounce_ev (fn) {
    // Setup a timer
    let timeout

    // Return a function to run debounced
    return function (event) {
        // Setup the arguments
        const context = this
        // Persist React Synthetic Event
        event.persist()

        // If there's a timer, cancel it
        if (timeout) {
            window.cancelAnimationFrame(timeout)
        }

        // Setup the new requestAnimationFrame()
        timeout = window.requestAnimationFrame(function () {
            fn.call(context, event)
        })
    }
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
