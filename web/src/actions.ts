import { Actions } from './ReduxTypes';

export function resetGithubToken(): Actions {
  return {
    type: 'RESET_GITHUB_TOKEN',
  };
}

export function setGithubToken(token: string): Actions {
  return {
    type: 'SET_GITHUB_TOKEN',
    token,
  };
}

export function createUser(password: string): Actions {
  return {
    type: 'CREATE_USER',
    password,
  };
}