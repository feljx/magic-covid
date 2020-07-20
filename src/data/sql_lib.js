const fs = require('fs')
const covid_data = require('./raw/covid19.json')

function create_table (name, cols, primary_key) {
	const col_string = Object.entries(cols)
		.map(([ col, type ]) => `${col} ${type}`)
		.join(',\n\t')
	return `DROP TABLE IF EXISTS ${name};
CREATE TABLE ${name} (
	${col_string},
	PRIMARY KEY(${primary_key})
);`
}

function insert_into (table, ...vals) {
	const val_string = vals.map((v) => v || 'NULL').join(', ')
	return `INSERT INTO ${table} VALUES (${val_string});`
}

function write_sql (filename, data) {
	fs.writeFileSync(`${__dirname}/sql/${filename}.sql`, data, 'utf8')
}

function parse_table (table, cols, primary_key, reducer) {
	const ct = create_table(table, cols, primary_key)
	const ins = reducer(covid_data)
		.map((insert_vals) => insert_into(table, ...insert_vals))
		.join('\n')
	const data = `${ct}\n${ins}`
	write_sql(table, data)
}

function textify (inp) {
	return inp ? `'${inp}'` : ''
}
module.exports = { insert_into, parse_table, textify }
