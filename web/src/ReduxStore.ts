/**
 * Main redux store and types.
 */
import {
  applyMiddleware,
  combineReducers,
  compose,
  createStore,
  Store as ReduxStore,
  StoreEnhancer,
} from 'redux';

import {
  ApolloClient,
  createNetworkInterface,
} from 'react-apollo';

import * as reducers from './reducers';
import {
  Actions,
  State,
  UserState,
  AUTH_PATH,
} from './ReduxTypes';

const GITHUB_GRAPHQL_URL = 'https://api.github.com/graphql';

function getReduxDevtools() {
  const w: any = window;
  if (w && typeof w.__REDUX_DEVTOOLS_EXTENSION__ !== 'undefined') {
    return w.__REDUX_DEVTOOLS_EXTENSION__;
  }
  return (f: any) => f;
}

export default function(state = {}): ReduxStore<State> {
  const networkInterface = createNetworkInterface({
    uri: GITHUB_GRAPHQL_URL,
    opts: {
      headers: {},
    }
  });

  const apollo = new ApolloClient({
    networkInterface,
  });

  // TODO: Rehydrate from a previous state.
  const initialState: State = {
    authRoute: AUTH_PATH,
    userState: UserState.NeedsSignup,
    ...state,
    // apollo may _not_ be overrwriten.
    apollo,
  };

  const middleware = compose(
    applyMiddleware(apollo.middleware()),
    getReduxDevtools(),
  );

  const store: ReduxStore<State> = createStore<State>(
    combineReducers<State>({
      ...reducers,
      apollo: apollo.reducer(),
    }),
    initialState,
    // Turn off warnings in middleware compsose.
    compose<any>(
      applyMiddleware(apollo.middleware()),
      getReduxDevtools(),
    )
  );

  networkInterface.use([
    {
      applyMiddleware(req, next) {
        const {currentGithubToken} = store.getState();
        if (!currentGithubToken) {
          next(new Error('Cannot issue github requests without token'));
          return;
        }
        req.options.headers = currentGithubToken;
        next();
      }
    }
  ]);

  return store;
}