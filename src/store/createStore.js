import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import { routerMiddleware } from 'connected-react-router'

import clientLoggerMiddleware from './middleware/clientLoggerMiddleware'
import createReducer from './createReducer'

export default function configureStore(initialState, history = false) {
  const middleware = [
    routerMiddleware(history),
    thunk,
    ...(__DEV__ ? [clientLoggerMiddleware] : []),
  ]

  const enhancer = applyMiddleware(...middleware)

  const store = createStore(
    createReducer(history),
    initialState,
    enhancer,
  )

  if (__DEV__ && module.hot) {
    module.hot.accept('./createReducer', () => {
      // eslint-disable-next-line global-require
      store.replaceReducer(require('./createReducer').default)
    })
  }

  return store
}
