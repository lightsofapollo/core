/**
 * Exports web primitives. Allows easy shiming and nicer import syntax.
 *
 * @noflow
 */

const {
  TextEncoder,
  TextDecoder,
  crypto,
  indexedDB,
  IDBKeyRange,
} = window;

module.exports = {
  TextEncoder,
  TextDecoder,
  crypto,
  idb: {
    indexedDB,
    IDBKeyRange,
  },
};
