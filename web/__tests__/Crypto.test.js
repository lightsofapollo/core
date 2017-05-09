import * as Crypto from '../src/Crypto';

describe('Crypto', () => {

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
        expect(one.toString('hex')).toBe(two.toString('hex'));

        const bytes = parseInt(opt.hash.replace('SHA-', ''), 10);
        expect(one.length).toBe(bytes);
      });
    }
  });

});
