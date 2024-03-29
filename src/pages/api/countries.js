import { ALL_COUNTRIES } from '../../data/api_query'
import { query_db } from '../../data/db_query'

export default async function detailHandler (req, res) {
	// const { query: { id, name }, method } = req

	try {
		const rows = await query_db(ALL_COUNTRIES)
		return res.status(200).json({
			countries: rows,
		})
	} catch (error) {
		console.error(error)
	}

	// res.setHeader('Allow', ['GET', 'PUT'])
	// res.status(405).end(`Method ${method} Not Allowed`)
}
