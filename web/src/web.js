/**
 * This file provides shim for the node environment see web.browser.js
 *
 * @noflow
 */
import path from 'path';
import { reserveTmpDir } from '../__tests__/setup';

if (process.env.NODE_ENV !== 'test') {
  throw new Error(`${__filename} should not be invoked outside of NODE_ENV=test`);
}

const idbFactory = require('indexeddbshim');
const idb = {};

idbFactory(idb, {
  // We don't care about origin in our tests ...
  checkOrigin: false,
  databaseBasePath: reserveTmpDir(),
});

module.exports = {
  crypto: require('node-webcrypto-ossl'),
  idb: {
    indexedDB: idb.indexedDB,
    IDBKeyRange: idb.IDBKeyRange,
  },
}
