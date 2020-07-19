export default function detailHandler (req, res) {
	const { query: { id, name }, method } = req

	console.log(id, name)

	res.status(200).json({
		foo: id,
		bar: name,
		cities: [ 'Berlin', 'New York', 'Paris', 'London' ],
	})
	// res.setHeader('Allow', ['GET', 'PUT'])
	// res.status(405).end(`Method ${method} Not Allowed`)
}
