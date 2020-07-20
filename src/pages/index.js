import Home from '../components/Home'
import { query_db } from '../data/db_query'
import { useEffect } from 'react'
import { use_global_state, update_cache } from '../state'
import { query_api, ALL_CONTINENTS, ALL_COUNTRIES } from '../data/api_query'

function Index (props) {
	// useEffect(function () {
	// 	query_api('countries').then((res) =>
	// 		update_cache({ countries: res.rows })
	// 	)
	// })
	return <Home />
}

export default Index

export const getServerSideProps = async () => {
	try {
		const continents = await query_db(ALL_CONTINENTS)
		const countries = await query_db(ALL_COUNTRIES)
		return {
			props: {
				foo: 'bar'
			}
		}
	} catch (error) {
		console.error(error)
	}
}
