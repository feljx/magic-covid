// imports
const child_process = require('child_process')
const fs = require('fs')

// constants
const DB_NAME = 'cf'
const POSTGRES_IMPORT_CMD = `psql -d ${DB_NAME} -f`
const SQL_FILES_DIR = 'src/data/sql'
// sql files to import (order matters because of foreign key references)
const SQL_FILES_TO_IMPORT = [ 'continents', 'countries', 'datapoints' ]

// import sql file
async function import_sql_file (filename) {
	return new Promise(function (resolve, reject) {
		child_process.exec(`${POSTGRES_IMPORT_CMD} ${filename}`, function (
			error,
			stdout,
			stderr
		) {
			console.error(stderr)
			resolve()
		})
	})
}

// import sql files
async function import_files (sql_files_to_import) {
	// loop through files to import, await each import to avoid reference errors
	for (const filename of sql_files_to_import) {
		await import_sql_file(filename)
	}
}

// import all sql files and subsequently all sql mod files
async function import_all () {
	// get filenames from args OR use filenames from constant list
	const argument_given = !!process.argv[2]
	const sql_files_to_import = argument_given
		? process.argv.slice(2)
		: SQL_FILES_TO_IMPORT.map((f) => `${SQL_FILES_DIR}/${f}.sql`)

	await import_files(sql_files_to_import)

	// read all mod files from mods folder
	const SQL_MOD_DIR = `${SQL_FILES_DIR}/mods`
	const sql_mods_to_import = fs
		.readdirSync(SQL_MOD_DIR)
		.map((filename) => `${SQL_MOD_DIR}/${filename}`)

	await import_files(sql_mods_to_import)
}

// execution starts here
import_all()
