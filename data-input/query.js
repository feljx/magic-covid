const pg = require('pg')

const URL =
	'postgres://ootzddtw:51poFZTMbSQMH5Nw4dcWmF34-Z-FtsHh@rogue.db.elephantsql.com:5432/ootzddtw'

const client = new pg.Client(URL)

function query(query_string) {
	client.connect(function (err) {
		if (err) console.error(err)
		client.query(query_string, function (err, result) {
			if (err) console.error(err)
			console.log(result)
			client.end()
		})
	})
}

module.exports = query
