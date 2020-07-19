const { insert_into, parse_table, textify } = require('./lib_sql')

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
			...new Set(raw.records.map((r) => r.continentExp))
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
		code: 'varchar(6) NULL',
		pop: 'bigint DEFAULT NULL',
		continent: 'text REFERENCES continents'
	},
	// primary key
	'name',
	// reducer
	// maps raw json input to array of column values to insert (in correct order)
	function (raw) {
		const set_of_uniques = new Set(
			raw.records.map((r) =>
				// stringify tuple to allow Set class to filter for unique values
				JSON.stringify([
					r.countriesAndTerritories,
					r.countryterritoryCode,
					r.popData2018,
					r.continentExp
				])
			)
		)
		// convert set back to array by spreading contents into array literal
		return [ ...set_of_uniques ].map((stringified_tuple) => {
			// parse stringified tuple to get values
			const [ name, code, pop, continent ] = JSON.parse(stringified_tuple)
			return [ textify(name), textify(code), pop, textify(continent) ]
		})
	}
)

// PARSE datapoints
parse_table(
	// table name
	DATA_POINTS,
	// columns
	{
		country: `text REFERENCES ${COUNTRIES}`,
		time: 'date',
		cases: 'bigint NULL',
		deaths: 'bigint NULL'
	},
	// primary key
	'country, time',
	// reducer
	// maps raw json input to array of column values to insert (in correct order)
	function (raw) {
		return raw.records.map((r) => [
			textify(r.countriesAndTerritories),
			textify(`${r.year}-${r.month}-${r.day}`),
			r.cases,
			r.deaths
		])
	}
)
