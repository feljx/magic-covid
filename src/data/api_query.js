export const ALL_CONTINENTS = 'SELECT * FROM continents;'
export const ALL_COUNTRIES = 'SELECT * FROM countries;'

export async function query_api (query_string) {
	const origin = window.location.href.endsWith('/')
		? window.location.href
		: window.location.href + '/'
	console.log(origin)
	const api_promise = await fetch(`${origin}api/${query_string}`)
	return api_promise.json()
}
