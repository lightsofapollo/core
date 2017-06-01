/**
 * Easy to use crypto utils for wider use within web/
 *
 * @flow
 */

import invariant from 'assert';
import { crypto, TextEncoder, TextDecoder, } from './web';
import type { BufferSource, HashAlgorithm, } from './web';

const subtle = crypto.subtle;

type PBKDF2Opts = {
  +salt: $ArrayBufferView,
  +iterations: number,
  +hash: HashAlgorithm,
};

export type PasswordOptions = PBKDF2Opts;

type PBKDF2InputOpts = {
  +salt?: $ArrayBufferView,
  +iterations?: number,
  +hash?: HashAlgorithm,
}

export type Encrypted = {
  +encrypted: ArrayBuffer,
  +iv: $ArrayBufferView,
};

export type PBKDFResult = {
  hash: ArrayBuffer,
  options: PBKDF2Opts,
};

const HASH_TO_BIT_LENGTH = {
  'SHA-256': 256 << 3,
  'SHA-384': 384 << 3,
  'SHA-512': 512 << 3,
};

function encode(input: string): Uint8Array {
  const enc = new TextEncoder();
  return enc.encode(input);
}

function decode(input: BufferSource): string {
  const decode = new TextDecoder();
  return decode.decode(input);
}

async function sha256(input: string | BufferSource) {
  if (typeof input === 'string') {
    input = encode(input);
  }
  return crypto.subtle.digest('SHA-256', input);
}

/**
 * Domain specific encrypt function.
 *
 * The input password is hashed using PBKDF2 and then hashed again using sha256
 * for sizing.
 *
 */
export async function encrypt(
  plaintext: string,
  pbkdf2Opts: PBKDF2InputOpts,
  password: string
): Promise<{
  encrypted: Encrypted,
  passwordOptions: PBKDF2Opts,
}> {
  const {hash: passwordHash, options: passwordOptions, } =
    await pbkdf2(password, pbkdf2Opts);

  const passwordKeyContent = await sha256(passwordHash);
  /**
   * Spec states ideal IV is 12 bytes (96 bits).
   * @see http://csrc.nist.gov/groups/ST/toolkit/BCM/documents/proposedmodes/gcm/gcm-spec.pdf
   */
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const alg = { name: 'AES-GCM', iv, };
  const key = await subtle.importKey(
    'raw', passwordKeyContent, alg, false, ['encrypt', ]
  );
  const encryptedText = await subtle.encrypt(alg, key, encode(plaintext));

  return {
    encrypted: {
      iv,
      encrypted: encryptedText,
    },
    passwordOptions,
  };
}

export async function decrypt(
  {encrypted, iv, }: Encrypted,
  passwordOptions: PBKDF2Opts,
  password: string
): Promise<string> {
  const {hash, } = await pbkdf2(password, passwordOptions);
  const keyContent = await sha256(hash);
  const alg = { name: 'AES-GCM', iv, };
  const key = await subtle.importKey(
    'raw', keyContent, alg, false, ['decrypt', ]
  );
  const decryptBuffer = await subtle.decrypt(alg, key, encrypted);
  return decode(decryptBuffer);
}

export const DEFAULT_PBKDF2_ITERATIONS = 10000;

function generateSalt(bytes = 8): $ArrayBufferView {
  const arr = new Uint8Array(bytes);
  crypto.getRandomValues(arr);
  return arr;
}


export async function pbkdf2(
  password: string,
  options: PBKDF2InputOpts,
): Promise<PBKDFResult> {
  const salt = options.salt || generateSalt();
  const hash = options.hash || 'SHA-512';
  const iterations = options.iterations || DEFAULT_PBKDF2_ITERATIONS;
  invariant(hash !== 'SHA-1', 'Use a different hashing function');

  // const {salt, iterations, hash, } = options;
  const key = await subtle.importKey(
    'raw',
    encode(password),
    'PBKDF2',
    false,
    ['deriveBits', ],
  );

  const bitLength = HASH_TO_BIT_LENGTH[hash];
  const passwordHash = await subtle.deriveBits({
    name: 'PBKDF2',
    salt: salt,
    iterations,
    hash,
  }, key, bitLength);

  return {
    hash: passwordHash,
    options: {
      iterations,
      salt,
      hash,
    },
  };

}
