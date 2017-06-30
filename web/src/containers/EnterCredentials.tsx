import * as React from 'react';
import {
  Grid,
  Row,
  Col,
} from 'react-bootstrap';

import {
  connect,
} from 'react-redux';

import {
  UserState
} from '../ReduxTypes';
import SignUpUI from '../components/SignUp';
import GithubTokenUI from '../components/GithubToken';
import {createUser} from '../actions';

const SignUp = connect(
  null,
  (dispatch) => {
    return {
      onComplete(password: string) {
        dispatch(createUser(password));
      }
    }
  }
)(SignUpUI);

function Login() {
  return <div></div>;
}

function NeedsToken() {
  return <div></div>;
}

function Active() {
  return <div></div>;
}

function stateToComp(userState: UserState) {
  switch (userState) {
    case UserState.NeedsLogin:
      return Login;
    case UserState.NeedsToken:
      return NeedsToken;
    case UserState.NeedsSignup:
      return SignUp;
    case UserState.Active:
      return Active;
  }
}

function GithubUI({userState}: {
  userState: UserState,
}) {
  const Component = stateToComp(userState);
  return (
    <div>
      <h1>Doing things</h1>
      <Component />
    </div>
  )
}

export default connect(
  (state, ownProps) => {
    return {
      userState: state.userState,
    }
  }
)(GithubUI);