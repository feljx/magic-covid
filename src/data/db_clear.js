// imports
const child_process = require('child_process')

// constants
const DB_NAME = 'cf'
const POSTGRES_CLEAR_CMD = `PGPASSWORD=rovidceport psql -U covidreport -d ${DB_NAME} -c`
const SQL_DROP_TABLES_CMD = (t) => `DROP TABLE IF EXISTS ${t};`

// tables to drop (order matters because of foreign key references)
const DB_TABLES_TO_DROP = [ 'datapoints', 'countries', 'continents' ]

// drop sql table by executing shell command
// returns promise so that async function can await it
function drop_table (table) {
    const full_cmd = `${POSTGRES_CLEAR_CMD} '${SQL_DROP_TABLES_CMD(table)}'`
    return new Promise((resolve, reject) => {
        child_process.exec(full_cmd, function (error, stdout, stderr) {
            if (error) {
                process.stderr.write(stderr)
                reject(error)
            }
            process.stdout.write(stdout)
            resolve()
        })
    })
}

// drop all tables
// async to wait for each table to be dropped before dropping next
// prevents reference/relationship/foreign key errors
async function drop_tables (tables) {
    try {
        for (const t of tables) {
            await drop_table(t)
        }
    } catch (error) {
        console.error(error)
    }
}

// execution starts here
// drop all tables defined as a constant above
drop_tables(DB_TABLES_TO_DROP)
