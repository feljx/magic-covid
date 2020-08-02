import { ALL_COUNTRIES, WORLD_MAP_DATA } from '../../data/api_query'
import { query_db } from '../../data/db_query'

export default async function detailHandler (req, res) {
    const { query: { start, end }, method } = req

    try {
        const rows = await query_db(WORLD_MAP_DATA(start, end))
        return res.status(200).json({
            data: rows,
        })
    } catch (error) {
        console.error(error)
    }

    // res.setHeader('Allow', ['GET', 'PUT'])
    // res.status(405).end(`Method ${method} Not Allowed`)
}
