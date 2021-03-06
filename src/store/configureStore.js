import {createBrowserHistory} from 'history'
import {applyMiddleware, compose, createStore} from 'redux'
import {routerMiddleware} from 'connected-react-router'
import createRootReducer from './reducers'
import thunk from 'redux-thunk';

export const history = createBrowserHistory();

const logger = store => next => action => {
    console.log('dispatching', action);
    return next(action);
};

export default function configureStore(preloadedState) {
    const composeEnhancer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
    return createStore(
        createRootReducer(history), // root reducer with router state
        preloadedState,
        composeEnhancer(
            applyMiddleware(
                routerMiddleware(history), // for dispatching history actions
                thunk,
                logger
                // ... other middlewares ...
            ),
        ),
    )
}