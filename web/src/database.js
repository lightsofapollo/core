/**
 * @flow
 */
import Dexie from 'dexie';
import idb from './idb';
import invariant from 'invariant';

const VERSION_ONE = {
  githubCredentials: '&id, name, createdAt, encrypted',
}

type GithubCredential = {
  id: string;
  name: string;
  createdAt: Date;
  encrypted: {
    token: string;
    salt: string;
    iterations: number;
  };
}

/**
 * Central module for handling all database logic and opeartions.
 */
class Database {
  db: Dexie;
  constructor(name: string) {
    const db = new Dexie(name, {
      autoOpen: true,
      ...idb,
    });
    this.db = db;
    db.version(1).stores(VERSION_ONE);
  }

  /**
   * Destroy the database (only for tests).
   */
  destroy() {
    return this.db.delete();
  }

  githubCredentials(): Array<GithubCredential> {
    return this.db.githubCredentials.toArray();
  }

  insertGithuCredential(cred: GithubCredential) {
    const {githubCredentials} = this.db;
    return githubCredentials.add(cred);
  }

  deleteGithubCredential(cred: GithubCredential | string) {
    const {githubCredentials} = this.db;
    if (typeof cred === 'string') {
      return githubCredentials.delete(cred);
    }
    return this.deleteGithubCredential(cred.id);
  }

}

export default function openDatabase(name): Data {
  return new Database(name);
}
