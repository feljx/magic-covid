const data = require('../foo.json')

function HomePage() {
	const items = Object.entries(data).map(([k, v]) => <li key={k}>{v}</li>)

    return <ul>{items}</ul>
}

export default HomePage
