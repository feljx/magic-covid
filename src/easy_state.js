let _state = {
	foo: 'lol'
}
const state = _state

export function get_state () {
	return _state
}

export function update_state (partial_state) {
	_state = { ..._state, ...partial_state }
}
