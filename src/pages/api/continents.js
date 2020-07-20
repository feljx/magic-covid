import { ALL_CONTINENTS } from '../../data/api_query'
import { query_db } from '../../data/db_query'

export default async function detailHandler (req, res) {
	// const { query: { id, name }, method } = req

	try {
		const rows = await query_db(ALL_CONTINENTS)
		return res.status(200).json({
			countries: rows.map((r) => r.name)
		})
	} catch (error) {
		console.error(error)
	}

	// res.setHeader('Allow', ['GET', 'PUT'])
	// res.status(405).end(`Method ${method} Not Allowed`)
}
