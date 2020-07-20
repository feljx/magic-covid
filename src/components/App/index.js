import { StateProvider } from '../../state'

export default function App ({ Component, pageProps }) {
	return (
		<StateProvider>
			<Component {...pageProps} />
		</StateProvider>
	)
}
