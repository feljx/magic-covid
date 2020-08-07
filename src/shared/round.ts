function round (x: number) {
    return +Math.round(Number(String(x) + 'e+2' + 'e-2'))
}

export default round
