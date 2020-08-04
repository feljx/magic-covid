const child_process = require('child_process')
const fs = require('fs')

const TABLES = [ 'datapoints', 'countries', 'continents' ]
const PWD = 'PGPASSWORD=rovidceport'
const USR = '-U covidreport'
const PSQL = `${PWD} psql ${USR} -d cf`

const OPERATIONS = {
    clear: async () => {
        // clear all sql tables
        for (const table of TABLES)
            await new Promise((resolve) => {
                const sql = `DROP TABLE IF EXISTS ${table};`
                const cmd = `${PSQL} -c '${sql}'`
                child_process.exec(cmd, (error, stdout, stderr) => {
                    process.stdout.write(stdout)
                    process.stderr.write(stderr)
                    if (error) throw error
                    resolve()
                })
            })
    },
    feed: async () => {
        // order sql files for tables and mods
        const dir = 'src/data/sql'
        const mods = fs.readdirSync(`${dir}/mods`).map((file) => `${`mods`}/${file}`)
        const withExt = (t) => `${t}.sql`
        const orderedFiles = TABLES.map(withExt).reverse().concat(mods)

        // import files in order
        for (const file of orderedFiles) {
            await new Promise((resolve) => {
                const cmd = `${PSQL} -f ${dir}/${file}`
                child_process.exec(cmd, (error, _, stderr) => {
                    process.stderr.write(stderr)
                    if (error) throw error
                    resolve()
                })
            })
        }
    },
}

// Script Execution
const mode = process.argv[2]
const operation = OPERATIONS[mode]

if (operation) {
    operation()
}

// Database Querying and Exports
const { Pool } = require('pg')
const os = require('os')

const IS_MAC = os.platform() === 'darwin'
const SOCKET_PATH = IS_MAC ? '' : process.env.DB_SOCKET

let pool

export function initPool () {
    pool = new Pool({
        host: SOCKET_PATH,
        user: process.env.DB_USER,
        password: process.env.DB_PW,
        database: process.env.DB_NAME,
        max: 20,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 2000,
    })

    // the pool will emit an error on behalf of any idle clients
    // it contains if a backend error or network partition happens
    pool.on('error', (err, client) => {
        console.error('Unexpected error on idle client', err)
        process.exit(-1)
    })
}

// async/await - check out a client
export async function query_db (sql_query, ...params) {
    if (!pool) {
        initPool()
    }

    const client = await pool.connect()
    let res
    try {
        res = await client.query(sql_query, params)
    } finally {
        // Make sure to release the client before any error handling,
        // just in case the error handling itself throws an error.
        client.release()
    }
    return res.rows
}
