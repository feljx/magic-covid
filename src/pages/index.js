import { query } from '../db/query'
import Home from '../components/Home'

export default Home

export const getServerSideProps = async () => {
	try {
		const sql_query = 'SELECT * FROM countries;'
		const rows = await query(sql_query)
		return {
			props: {
				rows
			}
		}
	} catch (error) {
		console.error(error)
	}
}
