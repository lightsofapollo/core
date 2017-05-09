/**
 * Easy to use crypto utils for wider use within web/
 *
 * @flow
 */

import { crypto, TextEncoder, TextDecoder, } from './web';
const subtle = crypto.subtle;

type PBKDF2Opts = {
  +salt: string,
  +iterations: number,
  +hash: 'SHA-256' | 'SHA-384' | 'SHA-512',
};

type EncryptOut = {
  +encrypted: ArrayBuffer,
  +iv: ArrayBuffer,
};

const HASH_TO_BIT_LENGTH = {
  'SHA-256': 256 << 3,
  'SHA-384': 384 << 3,
  'SHA-512': 512 << 3,
};

function encode(input: string): ArrayBuffer {
  // $FlowFixMe: Bug says constructor cannot be called.
  const enc = new TextEncoder();
  return enc.encode(input);
}

function decode(input: ArrayBuffer): string {
  // $FlowFixMe: Bug says constructor cannot be called.
  const decode = new TextDecoder();
  return decode.decode(input);
}

async function sha256(input: string) {
  return crypto.subtle.digest('SHA-256', encode(input));
}

export async function encrypt(
  plaintext: string, password: string
): Promise<EncryptOut> {
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
  {encrypted, iv, }: EncryptOut, password: string
): Promise<string> {
  const passwordHash = await sha256(password);
  const alg = { name: 'AES-GCM', iv, };
  const key = await subtle.importKey(
    'raw', passwordHash, alg, false, ['decrypt', ]
  );
  const decryptBuffer = await subtle.decrypt(alg, key, encrypted);
  return decode(decryptBuffer);
}

export async function pbkdf2(
  password: string, options: PBKDF2Opts
): Promise<ArrayBuffer> {
  const {salt, iterations, hash, } = options;
  const key = await subtle.importKey(
    'raw',
    encode(password),
    { name: 'PBKDF2', },
    false,
    ['deriveBits', ],
  );

  const bitLength = HASH_TO_BIT_LENGTH[hash];
  return subtle.deriveBits({
    name: 'PBKDF2',
    salt: encode(salt),
    iterations,
    hash: {
      name: hash,
    },
  }, key, bitLength);
}
