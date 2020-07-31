export const ALL_CONTINENTS = 'SELECT * FROM continents;'

export const ALL_COUNTRIES = 'SELECT * FROM countries;'

export const DATAPOINTS = (geo_code) =>
    `SELECT * FROM datapoints WHERE geo_code = '${geo_code}';`

export const WORLD_MAP_DATA = (start, end) => `
SELECT
    d.geo_code,
    c.name,
    c.pop,
    SUM(d.cases) AS cases,
    SUM(d.deaths) AS deaths,
    COUNT(1) AS daycount
FROM
    datapoints d, countries c
WHERE
    d.geo_code = c.geo_code
AND
    time BETWEEN '${start}' AND '${end}'
GROUP BY
    d.geo_code, c.name, c.pop;`

export async function query_api (query_string) {
    const api_promise = await fetch(
        `${window.location.origin}/api/${query_string}`
    )
    return api_promise.json()
}
