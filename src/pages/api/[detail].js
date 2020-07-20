export default function detailHandler (req, res) {
	// const { query: { id, name }, method } = req

	res.status(200).json({
		cities: [ 'Berlin', 'New York', 'Paris', 'London' ]
	})
	// res.setHeader('Allow', ['GET', 'PUT'])
	// res.status(405).end(`Method ${method} Not Allowed`)
}
