/**
 * @flow
 */
import uuid from 'uuid';

import { encrypt, decrypt, } from '../Crypto'
// For now the database holds the canoncial type.
import type { GithubCredential, } from '../Database';

type CreateOptions = {
  +name: string;
  +password: string;
  +tokenToEncrypt: string;
};

export async function create({
  name, password, tokenToEncrypt,
}: CreateOptions): Promise<GithubCredential> {
  const encryptedToken = await encrypt(tokenToEncrypt, password);
  const id = uuid.v4();
  return {
    id,
    name,
    createdAt: new Date(),
    encryptedToken: encryptedToken,
  }
}

export async function decryptToken(
  cred: GithubCredential,
  password: string,
): Promise<string> {
  return await decrypt(cred.encryptedToken, password);
}
