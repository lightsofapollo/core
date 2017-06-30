import {
  Actions,
  State,
  UserState,
  AUTH_PATH,
} from './ReduxTypes';

export function githubToken(
  state: string | null = null,
  action: Actions,
): string | null {
  switch (action.type) {
    case 'SET_GITHUB_TOKEN':
      return action.token;
    case 'RESET_GITHUB_TOKEN':
      return null;
    default:
      return state;
  }
}

export function userState(
  state: UserState | null,
  actions: Actions,
) {
  if (!state) {
    return UserState.NeedsLogin;
  }
  return state;
}

export function authRoute(
  state: string = AUTH_PATH,
  actions: Actions,
) {
  return state;
}