/**
 * Global application states and actions. It is intended that every action is
 * defined within.
 *
 * @flow
 */
import type { Component } from 'react';
import type { Connector, ConnectedComponentClass } from 'react-redux';
import type {
  Store as ReduxStore,
  StoreEnhancer,
  Dispatch as ReduxDispatch,
} from 'redux';

export type State = {
}

export type Action = { type: string };
export type Store = ReduxStore<State, Action>;
export type Dispatch = ReduxDispatch<Action>;
