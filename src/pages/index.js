import Home from '../components/Home'
import { ALL_CONTINENTS, ALL_COUNTRIES } from '../data/api_query'
import { query_db } from '../data/db_query'

function Index (props) {
    return <Home {...props} />
}

export default Index

export const getServerSideProps = async () => {
    try {
        const items = [
            ...(await query_db(ALL_CONTINENTS)),
            ...(await query_db(ALL_COUNTRIES)),
        ]
        return {
            props: { items },
        }
    } catch (error) {
        console.error(error)
    }
}
