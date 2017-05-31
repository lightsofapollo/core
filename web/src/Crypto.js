/**
 * Easy to use crypto utils for wider use within web/
 *
 * @flow
 */

import { crypto, TextEncoder, TextDecoder, } from './web';
import type { BufferSource, } from './web';

const subtle = crypto.subtle;

type PBKDF2HashOpts = 'SHA-256' | 'SHA-384' | 'SHA-512';

type PBKDF2Opts = {
  +salt: $ArrayBufferView,
  +iterations: number,
  +hash: PBKDF2HashOpts,
};

export type Encrypted = {
  +encrypted: ArrayBuffer,
  +iv: $ArrayBufferView,
};

export type PBKDFResult = {
  passwordHash: ArrayBuffer,
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

async function sha256(input: string) {
  return crypto.subtle.digest('SHA-256', encode(input));
}

export async function encrypt(
  plaintext: string, password: string
): Promise<Encrypted> {
  const passwordHash = await sha256(password);
  /**
   * Spec states ideal IV is 12 bytes (96 bits).
   * @see http://csrc.nist.gov/groups/ST/toolkit/BCM/documents/proposedmodes/gcm/gcm-spec.pdf
   */
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const alg = { name: 'AES-GCM', iv, };
  const key = await subtle.importKey(
    'raw', passwordHash, alg, false, ['encrypt', ]
  );
  const encryptedText = await subtle.encrypt(alg, key, encode(plaintext));
  return {
    iv,
    encrypted: encryptedText,
  };
}

export async function decrypt(
  {encrypted, iv, }: Encrypted, password: string
): Promise<string> {
  const passwordHash = await sha256(password);
  const alg = { name: 'AES-GCM', iv, };
  const key = await subtle.importKey(
    'raw', passwordHash, alg, false, ['decrypt', ]
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
  options: {
    salt?: $ArrayBufferView,
    hash?: PBKDF2HashOpts,
    iterations?: number,
  },
): Promise<PBKDFResult> {
  const salt = options.salt || generateSalt();
  const hash = options.hash || 'SHA-512';
  const iterations = options.iterations || DEFAULT_PBKDF2_ITERATIONS;

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
    passwordHash,
    options: {
      iterations,
      salt,
      hash,
    },
  };

}
