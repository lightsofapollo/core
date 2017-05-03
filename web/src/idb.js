/**
 * Used only for testing /w jest.
 *
 * @noflow
 */

import path from 'path';
import { reserveTmpDir } from '../__tests__/setup';

if (process.env.NODE_ENV !== 'test') {
  throw new Error(`${__filename} should not be invoked outside of NODE_ENV=test`);
}

const idbFactory = require('indexeddbshim');
const context = {};

idbFactory(context, {
  // We don't care about origin in our tests ...
  checkOrigin: false,
  databaseBasePath: reserveTmpDir(),
});

module.exports = {
  indexedDB: context.indexedDB,
  IDBKeyRange: context.IDBKeyRange,
};
