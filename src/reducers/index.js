import {
  applyMiddleware,
  combineReducers,
  createStore,
  compose,
} from 'redux'
import ReduxThunk from 'redux-thunk'

import eventsReducer from './events'

const allReducers = combineReducers({
  eventsReducer,
})

const composeEnhancers = typeof window === 'object'
  && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
  ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
    // Specify extension’s options like name, actionsBlacklist, actionsCreators, serialize...
  }) : compose

const enhancer = composeEnhancers(
  applyMiddleware(ReduxThunk),
)

const store = createStore(allReducers, enhancer)

export default store
