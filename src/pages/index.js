import Home from '../components/Home'
// import { query_db } from '../data/db_query'
import { useEffect } from 'react'
import { use_global_state, update_cache, CacheUpdate } from '../state'
import { query_api, ALL_CONTINENTS, ALL_COUNTRIES } from '../data/api_query'

// function Index ({ continents, countries }) {
function Index () {
	const [ s, dispatch ] = use_global_state()
	useEffect(function () {
		// dispatch(new CacheUpdate({ continents, countries }))
		async function fill_cache () {
			const continents = await query_api('continents')
			const countries = await query_api('countries')
			dispatch(new CacheUpdate({ ...continents, ...countries }))
		}
		fill_cache()
	}, [])
	console.log(s.cache)

	return <Home />
}

export default Index

export const getServerSideProps = async () => {
	try {
		return {
			props: {},
		}
	} catch (error) {
		console.error(error)
	}
}
