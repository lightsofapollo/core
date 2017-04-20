/* @flow */
import React from 'react';
import ReactDOM from 'react-dom';
import { createStore } from 'redux'
import { Provider } from 'react-redux';

import { AppContainer } from 'react-hot-loader';
import CoreApp from './containers/CoreApp';

const store = createStore((state, action) => {
  return {};
});

const render = (Component) => {
  ReactDOM.render(
    <AppContainer>
      <Provider store={store}>
        { /* dispatch is unused here but makes flow happy */ }
        <CoreApp dispatch={store.dispatch} />
      </Provider>
    </AppContainer>,
    document.getElementById('root')
  );
};

render(CoreApp );

// Hot Module Replacement API
if (module.hot) {
  // $FlowFixMe: (.hot is monkey patched in and flow does not know about it)
  module.hot.accept('./components/App', () => {
    render(CoreApp)
  });
}
