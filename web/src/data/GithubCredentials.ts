/**
 * @flow
 */
import * as uuid from 'uuid';

import { decrypt, encrypt, } from '../Crypto';
// For now the database holds the canoncial type.
import { PasswordOptions, } from '../Crypto';
import { GithubCredential, } from '../Database';

interface CreateOptions {
  readonly name: string;
  readonly password: string;
  readonly tokenToEncrypt: string;
  readonly passwordOptions?: PasswordOptions;
}

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
    encryptedToken,
    passwordOptions: passwordOptionsResult,
  };
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
