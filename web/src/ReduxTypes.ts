import { ApolloClient } from 'react-apollo';
import { Dispatch as ReduxDispatch } from 'react-redux';

export const AUTH_PATH = '/auth';

export const enum UserState {
  NeedsSignup = 'USER_NEEDS_SIGNUP',
  NeedsToken = 'USER_NEEDS_TOKEN',
  NeedsLogin = 'USER_NEEDS_LOGIN',
  Active = 'USER_ACTIVE',
};

export type State = {
  userState: UserState;
  apollo: ApolloClient;
  currentGithubToken?: string;
  authRoute: string;
};

export type Actions =
 { type: 'CREATE_USER', password: string } |
 { type: 'LOGIN_USER', password: string } |
 { type: 'SET_GITHUB_TOKEN', token: string } |
 { type: 'RESET_GITHUB_TOKEN' };

export type Dispatch = (action: Actions) => void;
