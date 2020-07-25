const https = require('https')
const fs = require('fs')

const URL = 'https://opendata.ecdc.europa.eu/covid19/casedistribution/json/'

https
    .get(URL, (res) => {
        let json_body = ''

        res.on('data', (chunk) => {
            json_body += chunk
        })

        res.on('end', () => {
            try {
                fs.writeFileSync(
                    `${__dirname}/raw/covid19.json`,
                    json_body,
                    'utf8'
                )
            } catch (error) {
                console.error(error.message)
            }
        })
    })
    .on('error', (error) => {
        console.error(error.message)
    })
