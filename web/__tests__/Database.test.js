/* @flow */
import openDatabase from '../src/Database';
import uuid from 'uuid';

describe('openDatabase', () => {

  function credFactory() {
    return {
      id: uuid.v4(),
      name: uuid.v1(),
      createdAt: new Date(),
      encryptedToken: {
        iv: new Uint8Array(12),
        encrypted: new Uint8Array(17),
      },
    };
  }

  let database;
  beforeEach(() => {
    database = openDatabase(uuid.v4());
  });

  describe('githubCredential operations', () => {

    it('should be an empty list to start', async () => {
      const list = await database.githubCredentials();
      expect(list).toEqual([]);
    });

    it('should return inserted items', async () => {
      const creds = [credFactory(), credFactory(),];
      await Promise.all(creds.map((cred) => {
        return database.insertGithuCredential(cred);
      }));

      const result = await database.githubCredentials();
      expect(result).toEqual(creds);
    });

    it('should be able to remove creds', async () => {
      const cred = credFactory();
      await database.insertGithuCredential(cred);
      await database.deleteGithubCredential(cred);
      const list = await database.githubCredentials();
      expect(list).toEqual([]);
    });

  });

});
