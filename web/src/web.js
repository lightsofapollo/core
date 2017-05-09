/**
 * This file provides shim for the node environment see web.browser.js
 *
 * @noflow
 */
import { reserveTmpDir, } from '../__tests__/setup';
import { TextEncoder, TextDecoder, } from 'text-encoding';
import WebCrypto from 'node-webcrypto-ossl';

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
  TextEncoder,
  TextDecoder,
  crypto: new WebCrypto(), 
  idb: {
    indexedDB: idb.indexedDB,
    IDBKeyRange: idb.IDBKeyRange,
  },
}
