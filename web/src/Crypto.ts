/**
 * Easy to use crypto utils for wider use within web/
 *
 */
import * as assert from 'assert';
import { crypto, TextDecoder, TextEncoder } from './web';

const subtle = crypto.subtle;

export type PasswordOptions = {
  salt?: ArrayBuffer,
  hash?: AlgorithmIdentifier,
  iterations?: number,
} | Pbkdf2Params;

export type Encrypted = {
  readonly encrypted: ArrayBuffer,
  readonly iv: ArrayBufferView,
};

export type PBKDFResult = {
  hash: ArrayBuffer,
  options: Pbkdf2Params,
};

const SHA256_BITS = 256 * 8;
const SHA384_BITS = 384 * 8;
const SHA512_BITS = 512 * 8;

function hashBits(hash: AlgorithmIdentifier): number {
  switch (hash) {
    case 'SHA-256':
      return SHA256_BITS;
    case 'SHA-384':
      return SHA384_BITS;
    case 'SHA-512':
      return SHA512_BITS;
    default:
      throw new Error(`Invalid hash option : ${hash}`);
  }
}

function encode(input: string): Uint8Array {
  const enc = new TextEncoder();
  return enc.encode(input);
}

function decode(input: ArrayBufferView): string {
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
  pbkdf2Params: PasswordOptions,
  password: string
): Promise<{
  encrypted: Encrypted,
  passwordOptions: Pbkdf2Params,
}> {
  const {hash: passwordHash, options: passwordOptions, } =
    await pbkdf2(password, pbkdf2Params);

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
  passwordOptions: Pbkdf2Params,
  password: string
): Promise<string> {
  const {hash, } = await pbkdf2(password, passwordOptions);
  const keyContent = await sha256(hash);
  const alg = { name: 'AES-GCM', iv, };
  const key = await subtle.importKey(
    'raw', keyContent, alg, false, ['decrypt', ]
  );
  const decryptBuffer = await subtle.decrypt(alg, key, encrypted);
  return decode(new Uint8Array(decryptBuffer));
}

export const DEFAULT_PBKDF2_ITERATIONS = 10000;

function generateSalt(bytes = 8): ArrayBufferView {
  const arr = new Uint8Array(bytes);
  crypto.getRandomValues(arr);
  return arr;
}

export async function pbkdf2(
  password: string,
  options: PasswordOptions,
): Promise<PBKDFResult> {
  const salt = options.salt || generateSalt();
  const hash = options.hash || "SHA-512";
  const iterations = options.iterations || DEFAULT_PBKDF2_ITERATIONS;
  assert(hash !== 'SHA-1', 'Use a different hashing function');

  // const {salt, iterations, hash, } = options;
  const key = await subtle.importKey(
    'raw',
    encode(password),
    'PBKDF2',
    false,
    ['deriveBits', ],
  );

  const bits = hashBits(hash);
  const passwordHash = await subtle.deriveBits({
    name: 'PBKDF2',
    salt,
    iterations,
    hash,
  }, key, bits);

  return {
    hash: passwordHash,
    options: {
      name: String(hash),
      iterations,
      salt,
      hash,
    },
  };

}
