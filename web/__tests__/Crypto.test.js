/* @flow */
import * as Crypto from '../src/Crypto';

describe('Crypto', () => {

  function hex(input) {
    return new Buffer(input).toString('hex');
  }

  describe('pbkdf2', () => {
    const common = { iterations: 5, salt: 'salt', };
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
        expect(hex(one)).toBe(hex(two));
        const bytes = parseInt(opt.hash.replace('SHA-', ''), 10);
        expect(one.byteLength).toBe(bytes);
      });
    }
  });

  describe('encrypt/decrypt', () => {
    it('should work in/out', async () => {
      const text = 'foo';
      const pass = 'password';

      const enc = await Crypto.encrypt(text, pass);
      const dec = await Crypto.decrypt(enc, pass);
      expect(dec).toBe(text);
    });
  });

});
