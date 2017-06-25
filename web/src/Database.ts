import Dexie from 'dexie';
import { idb, } from './web';

import { Encrypted, } from './Crypto';

const VERSION_ONE = {
  githubCredentials: '&id, name, createdAt, encryptedToken',
};

export interface GithubCredential {
  readonly id: string;
  readonly name: string;
  readonly createdAt: Date;
  readonly encryptedToken: Encrypted;
  readonly passwordOptions: Pbkdf2Params;
}

class Database extends Dexie {
  githubCredentials: Dexie.Table<GithubCredential, string>;

  constructor(idbName: string) {
    super(idbName, {
      autoOpen: true,
      ...idb,
    });
    this.version(1).stores(VERSION_ONE);
  }
}

/**
 * Central module for handling all database logic and opeartions.
 */
class PublicApi {
  private db: Database;

  constructor(name: string) {
    this.db = new Database(name);
  }

  /**
   * Destroy the database (only for tests).
   */
  destroy() {
    return this.db.delete();
  }

  githubCredentials(): Promise<GithubCredential[]> {
    return this.db.githubCredentials.toArray();
  }

  insertGithuCredential(cred: GithubCredential) {
    return this.db.githubCredentials.add(cred);
  }

  deleteGithubCredential(cred: GithubCredential | string): Promise<void> {
    if (typeof cred === 'string') {
      return this.db.githubCredentials.delete(cred);
    }
    return this.deleteGithubCredential(cred.id);
  }
}

export default function openDatabase(name: string): PublicApi {
  return new PublicApi(name);
}
