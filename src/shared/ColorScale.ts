export function getMonth (n) {
    return MONTHS[n - 1]
}

/**
 * Color scale
 * @typedef {Object} ColorScale
 * @property {string} title - The title
 * @property {string} artist - The artist
 * @property {number} year - The year
 */

/**
 * 'value' method: 
 * @typedef {Object} ColorScale
 * @param {number[]} colorA
 * @param {number[]} colorB
 * @return {number[]} new color
 */

/**
 * Color scale factory
 * @param {number[]} colorA
 * @param {number[]} colorB
 * @return {number[]} new color
 */

export const ColorScale = (colorStart, colorEnd) => {
    /**
     * Get color value for given fraction 
     * @param {number} fraction
     * @return {number[]} new color
     */

    const value = (fraction) => []
    return { value }
}

export function get_color_fn (color_1, color_2) {
    return function (n) {
        const dr = color_2[0] - color_1[0]
        const dg = color_2[1] - color_1[1]
        const db = color_2[2] - color_1[2]
        const [ r, g, b ] = [
            dr * n + color_1[0],
            dg * n + color_1[1],
            db * n + color_1[2],
        ]
        return [ r, g, b ]
    }
}
