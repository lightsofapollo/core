import { combineReducers } from 'redux';

import {
  Actions,
  State,
} from './ReduxTypes';

export function githubToken(
  state: State,
  action: Actions,
): State {
  switch (action.type) {
    case 'SET_GITHUB_TOKEN':
      return {
        ...state,
        currentGithubToken: action.token,
      };
    case 'RESET_GITHUB_TOKEN':
      return {
        ...state,
        currentGithubToken: undefined,
      };
    default:
      return state;
  }
}