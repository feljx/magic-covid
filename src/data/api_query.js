export const ALL_CONTINENTS = 'SELECT * FROM continents;'
export const ALL_COUNTRIES = 'SELECT * FROM countries;'
export const DATAPOINTS = (geo_code) => `SELECT * FROM datapoints WHERE geo_code = '${geo_code}';`
export const WORLD = (date) => `
SELECT d.*, c.pop
FROM datapoints d, countries c
WHERE c.geo_code = d.geo_code
AND time = '${date}';`
export async function query_api(query_string) {
  const api_promise = await fetch(`${window.location.origin}/api/${query_string}`)
  return api_promise.json()
}
