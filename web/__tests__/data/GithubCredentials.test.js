/* @flow */
import * as GithubCredentials from '../../src/data/GithubCredentials';

describe('GithubCredentials', () => {

  it('should be able to create & decrypt', async () => {
    const password = 'password';
    const name = 'foobar';
    const token = 'token';

    const record = await GithubCredentials.create({
      name,
      password,
      tokenToEncrypt: token,
    });
    expect(record.name).toBe(name);

    const decrypt = await GithubCredentials.decryptToken(
      record,
      password
    );

    expect(decrypt).toBe(token);
  });

});
