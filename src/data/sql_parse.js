const { parse_table, textify } = require('./sql_lib')

// CONSTANTS
const CONTINENTS = 'continents'
const COUNTRIES = 'countries'
const DATA_POINTS = 'datapoints'

// PARSE continents
parse_table(
	// table name
	CONTINENTS,
	// columns
	{ name: 'text', pop: 'bigint DEFAULT NULL' },
	// primary key
	'name',
	// reducer
	// maps raw json input to array of column values to insert (in correct order)
	function (raw) {
		return [
			...new Set(raw.records.map((r) => r.continentExp)),
		].map((continent) => [ textify(continent), 'NULL' ])
	}
)

// PARSE countries
parse_table(
	// table name
	COUNTRIES,
	// columns
	{
		name: 'text',
		geo_code: 'varchar(9)',
		pop: 'bigint DEFAULT NULL',
		continent: 'text REFERENCES continents',
	},
	// primary key
	'geo_code',
	// reducer
	// maps raw json input to array of column values to insert (in correct order)
	function (raw) {
		const set_of_uniques = new Set(
			raw.records.map((r) =>
				// stringify tuple to allow Set class to filter for unique values
				JSON.stringify([
					r.countriesAndTerritories,
					r.geoId,
					r.popData2019,
					r.continentExp,
				])
			)
		)
		// convert set back to array by spreading contents into array literal
		return [ ...set_of_uniques ].map((stringified_tuple) => {
			// parse stringified tuple to get values
			const [ name, geo_code, pop, continent ] = JSON.parse(
				stringified_tuple
			)
			return [ textify(name), textify(geo_code), pop, textify(continent) ]
		})
	}
)

// PARSE datapoints
parse_table(
	// table name
	DATA_POINTS,
	// columns
	{
		geo_code: `text REFERENCES ${COUNTRIES}`,
		time: 'varchar(10)',
		cases: 'integer',
		deaths: 'integer',
	},
	// primary key
	'geo_code, time',
	// reducer
	// maps raw json input to array of column values to insert (in correct order)
	function (raw) {
		return raw.records.map((r) => [
			textify(r.geoId),
			textify(`${r.year}-${r.month}-${r.day}`),
			r.cases,
			r.deaths,
		])
	}
)
