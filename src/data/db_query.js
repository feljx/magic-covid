const { Pool } = require('pg')
const os = require('os')

const IS_MAC = os.platform() === 'darwin'
const SOCKET_PATH = IS_MAC ? '' : process.env.DB_SOCKET

const pool = new Pool({
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

// async/await - check out a client
export async function query_db (sql_query, ...params) {
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
