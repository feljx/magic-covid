import { get_state, update_state } from '../easy_state'
import { useEffect } from 'react'

function Detail (props) {
	const foo = get_state().foo
	const do_something = () =>
		update_state({
			foo:
				'HEY HELLO                                                           '
		})

	return (
		<div>
			<p>{foo}</p>
			<button onClick={do_something}>Click</button>
		</div>
	)
}

export default Detail

// export const getServerSideProps = async () => {
// 	try {
// 		const foo = get_state().foo || 'DEFAULT'
// 		return {
// 			props: { foo }
// 		}
// 	} catch (error) {
// 		console.error(error)
// 	}
// }
