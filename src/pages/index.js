import { query } from '../db/query'
import Home from '../components/Home'
import { useEffect } from 'react'

function Index () {
	useEffect(async function () {})
	return <Home />
}

export default Index

export const getServerSideProps = async () => {
	try {
		const sql_query = 'SELECT * FROM countries;'
		const rows = await query(sql_query)
		return {
			props: {
				rows,
			},
		}
	} catch (error) {
		console.error(error)
	}
}
