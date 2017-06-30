/* @flow */
import * as React from 'react';
import { render } from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import {
  HashRouter,
  Route,
  Switch,
} from 'react-router-dom';
import { ApolloProvider } from 'react-apollo';

import AuthRoute from './containers/AuthRoute';
import EnterCredentials from './containers/EnterCredentials';
import createStore from './ReduxStore';
import { connect } from 'react-redux';

const store = createStore();
const {apollo, authRoute} = store.getState();

const App = () => {
  return <p>Fo</p>;
}

function updateUI() {
  const app = (
    <AppContainer>
      <ApolloProvider client={apollo} store={store}>
        <HashRouter>
          <Switch>
            <AuthRoute exact path='/' component={App} />
            <Route path={authRoute}>
              <EnterCredentials />
            </Route>
          </Switch>
        </HashRouter>
      </ApolloProvider>
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
