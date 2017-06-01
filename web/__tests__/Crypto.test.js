/* @flow */
import invariant from 'assert';
import * as Crypto from '../src/Crypto';
import { crypto, } from '../src/web';

describe('Crypto', () => {

  function hex(input) {
    return new Buffer(input).toString('hex');
  }

  describe('pbkdf2', () => {
    const common = {
      iterations: 5,
      salt: crypto.getRandomValues(new Uint8Array(16)),
    };
    const options = [
      { hash: 'SHA-256', ...common, },
      { hash: 'SHA-384', ...common, },
      { hash: 'SHA-512', ...common, },
    ];

    for (let opt of options) {
      it(opt.hash, async () => {
        const pass = 'password';
        const [one, two, ] = await Promise.all([
          Crypto.pbkdf2(pass, opt),
          Crypto.pbkdf2(pass, opt),
        ]);

        const {hash: oneHash, options: oneOpts, } = one;
        const {hash: twoHash, options: twoOpts, } = two;

        expect(hex(oneHash)).toBe(hex(twoHash));
        expect(oneOpts).toEqual(twoOpts);
        invariant(opt.hash);
        const bytes = parseInt(opt.hash.replace('SHA-', ''), 10);
        expect(oneHash.byteLength).toBe(bytes);
      });
    }
  });

  describe('encrypt/decrypt', () => {
    it('should work in/out', async () => {
      const text = 'foo';
      const pass = 'password';

      const {encrypted: enc, passwordOptions, } = await Crypto.encrypt(text, {}, pass);
      const dec = await Crypto.decrypt(enc, passwordOptions, pass);
      expect(dec).toBe(text);
    });
  });

});
