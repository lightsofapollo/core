import * as React from 'react';

import {
  connect
} from 'react-redux';

import {
  Route,
  Redirect,
} from 'react-router-dom';

import {
  AUTH_PATH,
  UserState,
} from '../ReduxTypes';

type Comp = React.SFC<any> | React.ComponentClass<any>;

function CheckAuth({isAuthenticated, component, authRoute, ...props}: {
  authRoute: string,
  isAuthenticated: boolean,
  component: Comp,
}) {
  if (isAuthenticated) {
    return <Route {...props} component={component} />
  }
  return <Redirect to={authRoute} />;
}

export default connect((state, {component, ...props}: {
  component: Comp,
  // Sadly we need to strictly type this here even though we simply pass to Route.
  exact?: boolean,
  path?: string,
}) => {
  return {
    authRoute: state.authRoute,
    // XXX: Maybe we want a standlone function for evaultating logged in.
    isAuthenticated: state.userState === UserState.Active,
    component,
    ...props,
  }
})(CheckAuth);