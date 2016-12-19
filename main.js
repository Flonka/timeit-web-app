require('./style/app.scss')

import {createStore} from 'redux'

const store = createStore((state, action) => {
	return console.log(state, action)
})

console.log(store)

