import { createContext, useContext, useReducer, useState } from 'react'

const _global_state = {
	cache: {},
	foo: 'bar'
}

const CACHE_UPDATE = 'update_cache'
export function CacheUpdate (partial_state) {
	this.type = CACHE_UPDATE
	this.payload = partial_state
}

function global_reducer (state, action) {
	switch (action.type) {
		case CACHE_UPDATE:
			return { ...state, cache: { ...state.cache, ...action.payload } }
		default:
			return state
	}
}

const StoreContext = createContext(undefined)
const DispatchContext = createContext(undefined)

export function use_global_state () {
	const store = useContext(StoreContext)
	const dispatch = useContext(DispatchContext)
	if (store === undefined || dispatch === undefined) {
		throw new Error('useStore must be used within StoreProvider')
	}
	return [ store, dispatch ]
}

export const use_state = useState

export function StateProvider (props) {
	const [ store, dispatch ] = useReducer(global_reducer, _global_state)
	return (
		<StoreContext.Provider value={store}>
			<DispatchContext.Provider value={dispatch}>
				{props.children}
			</DispatchContext.Provider>
		</StoreContext.Provider>
	)
}
