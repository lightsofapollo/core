import { ApolloClient } from 'react-apollo';
import { Dispatch as ReduxDispatch } from 'react-redux';

export const enum UserState {
  NeedsSignup,
  NeedsToken,
  NeedsLogin,
  Active,
}

export type State = {
  userState: UserState;
  apollo: ApolloClient;
  currentGithubToken?: string;
};

export type Actions =
 { type: 'SET_GITHUB_TOKEN', token: string } |
 { type: 'RESET_GITHUB_TOKEN' };

export type Dispatch = (action: Actions) => void;