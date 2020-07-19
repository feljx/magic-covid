import '../_app.css'
import { StateProvider } from '../state'

// This default export is required in a new `pages/_app.js` file.
export default function MyApp ({ Component, pageProps }) {
	return (
		<StateProvider>
			<Component {...pageProps} />
		</StateProvider>
	)
}
