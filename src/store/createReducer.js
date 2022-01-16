import { combineReducers } from 'redux'

import { connectRouter } from 'connected-react-router'

import settings from './modules/settings/reducer'

export default (history) => combineReducers({
  router: connectRouter(history),
  settings,
})
