import { ALL_CONTINENTS, DATAPOINTS } from '../../data/api_query'
import { query_db } from '../../data/db_query'

export default async function detailHandler (req, res) {
	const { query: { geo_code } } = req

	try {
		return res.status(200).json({
			[geo_code]: await query_db(DATAPOINTS(geo_code)),
		})
	} catch (error) {
		console.error(error)
	}

	// res.setHeader('Allow', ['GET', 'PUT'])
	// res.status(405).end(`Method ${method} Not Allowed`)
}
