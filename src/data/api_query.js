export const ALL_CONTINENTS = 'SELECT * FROM continents;'
export const ALL_COUNTRIES = 'SELECT * FROM countries;'
export const DATAPOINTS = (geo_code) =>
	`SELECT * FROM datapoints WHERE geo_code = '${geo_code}';`

export async function query_api (query_string) {
	const api_promise = await fetch(
		`${window.location.origin}/api/${query_string}`
	)
	return api_promise.json()
}
