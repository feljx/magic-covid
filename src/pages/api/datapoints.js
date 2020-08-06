import { DATAPOINTS } from '../../data/api_query'
import { query_db } from '../../data/db_query'

export default async function detailHandler (req, res) {
    const { query: { geo_code_string } } = req
    const codes = geo_code_string.split(',')
    const data = {}
    for (const geo_code of codes) {
        data[geo_code] = await query_db(DATAPOINTS(geo_code))
    }

    try {
        return res.status(200).json({ data })
    } catch (error) {
        console.error(error)
    }

    // res.setHeader('Allow', ['GET', 'PUT'])
    // res.status(405).end(`Method ${method} Not Allowed`)
}
