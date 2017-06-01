/**
 * @flow
 */
import uuid from 'uuid';

import { encrypt, decrypt, } from '../Crypto'
// For now the database holds the canoncial type.
import type { GithubCredential, } from '../Database';
import type { PasswordOptions, } from '../Crypto';

type CreateOptions = {
  +name: string;
  +password: string;
  +tokenToEncrypt: string;
  +passwordOptions?: PasswordOptions;
};

export async function create({
  name,
  password,
  tokenToEncrypt,
  passwordOptions,
}: CreateOptions): Promise<GithubCredential> {
  const {
    encrypted: encryptedToken,
    passwordOptions: passwordOptionsResult,
  } = await encrypt(tokenToEncrypt, passwordOptions || {}, password);

  const id = uuid.v4();
  return {
    id,
    name,
    createdAt: new Date(),
    encryptedToken: encryptedToken,
    passwordOptions: passwordOptionsResult,
  }
}

export async function decryptToken(
  cred: GithubCredential,
  password: string,
): Promise<string> {
  return await decrypt(
    cred.encryptedToken,
    cred.passwordOptions,
    password
  );
}
