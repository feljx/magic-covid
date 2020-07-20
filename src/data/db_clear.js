// imports
const child_process = require('child_process')

// constants
const DB_NAME = 'cf'
const POSTGRES_CLEAR_CMD = `psql -d ${DB_NAME} -c`
const SQL_DROP_TABLES_CMD = (t) => `DROP TABLE IF EXISTS ${t};`
// tables to drop (order matters because of foreign key references)
const DB_TABLES_TO_DROP = [ 'datapoints', 'countries', 'continents' ]

// drop sql table by synchronously executing shell command
function drop_table (table) {
	const full_cmd = `${POSTGRES_CLEAR_CMD} '${SQL_DROP_TABLES_CMD(table)}'`
	child_process.exec(full_cmd, function (error, stdout, stderr) {
		if (error) process.stderr.write(stderr)
		process.stdout.write(stdout)
	})
}

// execution starts here
// drop all tables
for (const table of DB_TABLES_TO_DROP) {
	drop_table(table)
}
