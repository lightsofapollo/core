/**
 * Exports web primitives. Allows easy shiming and nicer import syntax.
 *
 * @noflow
 */

const {
  crypto,
  indexedDB,
  IDBKeyRange,
} = window;

module.exports = {
  crypto,
  idb: {
    indexedDB,
    IDBKeyRange,
  }
};
