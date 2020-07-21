import { createContext, useContext, useReducer, useState } from 'react'

const _global_state = {
	cache: {},
	foo: 'bar'
}

function global_reducer (state, action) {
	switch (action.type) {
		case CACHE_UPDATE:
			return { ...state, cache: { ...state.cache, ...action.payload } }
		default:
			return state
	}
}

// ACTION CONSTRUCTOR
const CACHE_UPDATE = 'update_cache'
export function CacheUpdate (partial_state) {
	this.type = CACHE_UPDATE
	this.payload = partial_state
}

// MANUAL STATE REDUCER (NO HOOKS)
export function update_cache (partial_state) {}

// CONTEXT SETUP
const StoreContext = createContext(undefined)
const DispatchContext = createContext(undefined)

// USE GLOBAL STATE HOOK
export function use_global_state () {
	const store = useContext(StoreContext)
	const dispatch = useContext(DispatchContext)
	if (store === undefined || dispatch === undefined) {
		throw new Error('useStore must be used within StoreProvider')
	}
	return [ store, dispatch ]
}

// RENAME useState for consistency
export const use_state = useState

// STATE PROVIDER
let _dispatch
export function StateProvider (props) {
	const [ store, dispatch ] = useReducer(global_reducer, _global_state)
	_dispatch = dispatch
	return (
		<StoreContext.Provider value={store}>
			<DispatchContext.Provider value={dispatch}>
				{props.children}
			</DispatchContext.Provider>
		</StoreContext.Provider>
	)
}
