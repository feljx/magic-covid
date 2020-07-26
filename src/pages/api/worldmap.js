import { ALL_COUNTRIES, WORLD } from '../../data/api_query'
import { query_db } from '../../data/db_query'

export default async function detailHandler (req, res) {
	const { query: { date }, method } = req

	try {
		const rows = await query_db(WORLD(date))
		return res.status(200).json({
			countries: rows,
		})
	} catch (error) {
		console.error(error)
	}

	// res.setHeader('Allow', ['GET', 'PUT'])
	// res.status(405).end(`Method ${method} Not Allowed`)
}
