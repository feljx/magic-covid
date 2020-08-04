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
        const mods = fs
            .readdirSync(`${dir}/mods`)
            .map((file) => `${`mods`}/${file}`)
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

const mode = process.argv[2]
const operation = OPERATIONS[mode]

if (operation) {
    operation()
}
