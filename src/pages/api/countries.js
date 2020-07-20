import { query } from '../../db/query'
import { ALL_COUNTRIES } from '../../query'

export default async function detailHandler (req, res) {
	// const { query: { id, name }, method } = req

	try {
		const rows = await query(ALL_COUNTRIES)
		return res.status(200).json({
			countries: rows.map((r) => r.name)
		})
	} catch (error) {
		console.error(error)
	}

	// res.setHeader('Allow', ['GET', 'PUT'])
	// res.status(405).end(`Method ${method} Not Allowed`)
}
