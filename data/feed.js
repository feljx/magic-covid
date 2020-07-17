const { insert_into, parse_table, textify } = require('./sql')

// CONSTANTS
const CONTINENTS = 'continents'
const COUNTRIES = 'countries'
const DATA_POINTS = 'datapoints'

// PARSE continents
const reducer_continents = (raw) =>
	[ ...new Set(raw.records.map((r) => r.continentExp)) ].map((continent) => [
		textify(continent),
		'NULL',
	])
parse_table(
	CONTINENTS,
	{ name: 'text', pop: 'bigint DEFAULT NULL' },
	'name',
	reducer_continents
)

// PARSE countries
const reducer_countries = (raw) =>
	[
		...new Set(
			raw.records.map((r) =>
				// stringify tuple to allow Set class to filter unique values
				JSON.stringify([
					r.countriesAndTerritories,
					r.countryterritoryCode,
					r.popData2018,
					r.continentExp,
				])
			)
		),
	].map((stringified_tuple) => {
		// parse stringified tuple to work with values
		const [ name, code, pop, continent ] = JSON.parse(stringified_tuple)
		return [ textify(name), textify(code), pop, textify(continent) ]
	})
parse_table(
	COUNTRIES,
	{
		name: 'text',
		code: 'varchar(6) NULL',
		pop: 'bigint DEFAULT NULL',
		continent: 'text REFERENCES continents',
	},
	'name',
	reducer_countries
)

// PARSE datapoints
const reducer_datapoints = (raw) =>
	raw.records.map((r) => [
		textify(r.countriesAndTerritories),
		textify(`${r.year}-${r.month}-${r.day}`),
		r.cases,
		r.deaths,
	])
parse_table(
	DATA_POINTS,
	{
		country: `text REFERENCES ${COUNTRIES}`,
		time: 'date',
		cases: 'bigint NULL',
		deaths: 'bigint NULL',
	},
	'country, time',
	reducer_datapoints
)
