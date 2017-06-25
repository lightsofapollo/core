import { TextEncoder, TextDecoder } from 'text-encoding';

interface IDB {
  indexedDB: IDBFactory,
  IDBKeyRange: typeof IDBKeyRange
}

interface SupportedWindowGlobals {
  TextDecoder: typeof TextDecoder,
  TextEncoder: typeof TextEncoder,
  crypto: Crypto,
  idb: IDB,
}

declare var WindowGlobals: SupportedWindowGlobals;
export = WindowGlobals;