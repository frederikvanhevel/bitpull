import { createStore, applyMiddleware, compose } from 'redux'
import createSagaMiddleware from 'redux-saga'

import rootSaga from './sagas'
import rootReducer from './reducers'

export const configureStore = (initialState = {}) => {
    const composeEnhancers =
        // @ts-ignore
        window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

    const sagaMiddleware = createSagaMiddleware()

    const createStoreWithMiddleware = composeEnhancers(
        applyMiddleware(sagaMiddleware)
    )(createStore)

    const store = createStoreWithMiddleware(rootReducer, initialState)

    sagaMiddleware.run(rootSaga)

    // persist state during hot reloads
    // @ts-ignore
    if (module.hot) {
        // @ts-ignore
        module.hot.accept(() => {
            const nextRootReducer = require('./reducers').default
            store.replaceReducer(nextRootReducer)
        })
    }

    return store
}

export type AppState = ReturnType<typeof rootReducer>
