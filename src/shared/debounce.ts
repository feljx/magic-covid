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

export function debounceEvent (fn) {
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
