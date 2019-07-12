import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import App from './components/App';
import storeConfiguration from './store';
import 'todomvc-app-css/index.css';

const store = storeConfiguration();

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root'),
);
