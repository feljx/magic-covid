const query = require('./query.js')
const data = require('../data-covid/covid19.json')

// CONSTANTS
const CONTINENTS = 'continents'

function create_table (table_name, col_string) {
	query(
		`CREATE TABLE ${table_name} (id SERIAL, ${col_string}, PRIMARY KEY (id));`
	)
}

function drop_table (table_name) {
	query(`DROP TABLE ${table_name};`)
}

function insert (table_name, col_string, val_string) {
	query(`INSERT INTO ${table_name} (${col_string}) VALUES (${val_string});`)
}

function create_continents () {
	create_table(CONTINENTS, 'name character[16], pop bigint NULL')
}

function add_continents () {
	const continents = []
	for (const record of data.records) {
		const continent = record.continentExp
		const already_added = continents.includes(continent)
		if (!already_added) continents.push(continent)
	}
	for (const continent of continents) {
		query(
			`INSERT INTO ${CONTINENTS} (name, pop) VALUES (${continent}, NULL);`
		)
	}
}

// drop_table(CONTINENTS)
// create_continents()
add_continents()
