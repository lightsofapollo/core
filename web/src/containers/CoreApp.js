/* @flow */
import { connect } from 'react-redux';
import type { ConnectedComponentClass } from 'react-redux';

import App from '../components/App';
import type {
  State,
  Dispatch,
} from '../types';

type Props = $PropertyType<App, 'props'>;
type OwnProps = { dispatch: Dispatch, ...Props };

const CoreApp: ConnectedComponentClass<OwnProps, Props, void, void> = connect(
  (state: State) => {
    return {
      message: 'Hello world',
    }
  },
  (dispatch: Dispatch) => {
    return {
    }
  },
)(App);

export default CoreApp;
