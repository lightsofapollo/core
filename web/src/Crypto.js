/**
 * Easy to use crypto utils for wider use within web/
 *
 * @flow
 */

import { crypto, TextEncoder } from './web';
const subtle = crypto.subtle;

const HASH_TO_BIT_LENGTH = {
  'SHA-256': 256 << 3,
  'SHA-384': 384 << 3,
  'SHA-512': 512 << 3,
};

export async function encrypt() {

}

export async function decrypt() {

}

type PBKDF2Opts = {
  +salt: string,
  +iterations: number,
  +hash: 'SHA-256' | 'SHA-384' | 'SHA-512',
} ;

export async function pbkdf2(
  password: string, options: PBKDF2Opts
): Buffer {
  const {salt, iterations, hash, } = options;

  const enc = new TextEncoder();
  const passwordInput = enc.encode(password);
  const saltInput = enc.encode(salt);

  const key = await subtle.importKey(
    'raw',
    passwordInput,
    { name: 'PBKDF2', },
    false,
    ['deriveBits', ],
  );

  const bitLength = HASH_TO_BIT_LENGTH[hash];
  const bits = await subtle.deriveBits({
    name: 'PBKDF2',
    salt: saltInput,
    iterations,
    hash: {
      name: hash,
    },
  }, key, bitLength);

  return Buffer.from(bits);
}
