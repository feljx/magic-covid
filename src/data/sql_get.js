const https = require('https')
const fs = require('fs')

const URL = 'https://opendata.ecdc.europa.eu/covid19/casedistribution/json/'

https
    .get(URL, (res) => {
        let body = ''

        res.on('data', (chunk) => {
            body += chunk
        })

        res.on('end', () => {
            try {
                fs.writeFileSync(`${__dirname}/raw/covid19.json`, body, 'utf8')
                // do something with JSON
            } catch (error) {
                console.error(error.message)
            }
        })
    })
    .on('error', (error) => {
        console.error(error.message)
    })
