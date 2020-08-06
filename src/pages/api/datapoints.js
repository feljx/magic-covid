import { DATAPOINTS } from '../../data/api_query'
import { query_db } from '../../data/db_query'

async function datapoints (req, res) {
    const { query: { geo } } = req
    console.log('QUERYSTRING:', geo)
    const codes = geo.split(',')
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

export default datapoints
