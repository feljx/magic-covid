import Home from '../components/Home'
import { ALL_CONTINENTS, ALL_COUNTRIES } from '../data/api_query'
import { query_db } from '../data/db_query'

function Index ({ continents, countries }) {
    return <Home continents={continents} countries={countries} />
}

export default Index

export const getServerSideProps = async () => {
    try {
        return {
            props: {
                continents: await query_db(ALL_CONTINENTS),
                countries: await query_db(ALL_COUNTRIES),
            },
        }
    } catch (error) {
        console.error(error)
    }
}
