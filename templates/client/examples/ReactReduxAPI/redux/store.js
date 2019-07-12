import { createStore, applyMiddleware, compose } from 'redux';
import { createLogger } from 'redux-logger';
import createSagaMiddleware from 'redux-saga';

import { isDevelopment } from '../config';
import reducer from './reducers';
import saga from './sagas';

const sagaMiddleware = createSagaMiddleware();

export default function configureStore(initialState = {}) {
  const middlewares = [
    sagaMiddleware,
  ];

  if (isDevelopment) {
    /* eslint-enable global-require, import/no-extraneous-dependencies */
    const logger = createLogger({
      level: 'info',
      duration: true,
      collapsed: true,
      diff: true,
    });

    middlewares.push(logger);
  }

  const enhancers = [
    applyMiddleware(...middlewares),
  ];

  // If Redux DevTools Extension is installed use it, otherwise use Redux compose
  /* eslint-disable no-underscore-dangle */
  const composeEnhancers = isDevelopment
    && typeof window === 'object'
    && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
      // TODO Try to remove when `react-router-redux` is out of beta,
      // LOCATION_CHANGE should not be fired more than once after hot reloading
      // Prevent recomputing reducers for `replaceReducer`
      shouldHotReload: false,
    })
    : compose;
  /* eslint-enable */

  return {
    ...createStore(
      reducer,
      initialState,
      composeEnhancers(...enhancers),
    ),
    runSaga: sagaMiddleware.run(saga),
  };
}
