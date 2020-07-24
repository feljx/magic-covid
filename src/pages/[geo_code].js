import Detail from '../components/Detail'
import { DATAPOINTS } from '../data/api_query'
import { query_db } from '../data/db_query'

export default Detail

export async function getServerSideProps (context) {
    const { geo_code } = context.params
    const rows = await query_db(DATAPOINTS(geo_code.toUpperCase()))

    return {
        props: {
            data: rows
                // @ts-ignore
                .filter((r) => r.cases >= 0)
                // @ts-ignore
                .sort((r1, r2) => (r1.time < r2.time ? -1 : 1))
                // @ts-ignore
                .map((r) => ({ ...r, time: String(r.time) })),
        },
    }
}
