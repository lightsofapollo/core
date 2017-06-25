/* @flow */
import * as React from 'react';
import { render } from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import App from './components/App';

function updateUI() {
  const app = (
    <AppContainer>
      <App message="sup" />
    </AppContainer>
  );
  render(app, document.getElementById('root'));
}
updateUI();

// Hot Module Replacement API
const myMod: any = module;
if (myMod.hot) {
  // $FlowFixMe: (.hot is monkey patched in and flow does not know about it)
  myMod.hot.accept('./components/App', updateUI);
}
