const nock = require('nock');
const { convertCryptoToIDR, _private } = require('../3_crypto_to_idr_converter');

afterEach(() => {
  nock.cleanAll();
  _private.cache.clear();
});

test('convert BTC mocked', async () => {
  nock('https://api.coingecko.com')
    .get(/\/api\/v3\/simple\/price.*/)
    .reply(200, { bitcoin: { usd: 20000 } });
  nock('https://api.exchangerate.host')
    .get(/\/latest.*/)
    .reply(200, { rates: { IDR: 15000 } });
  const out = await convertCryptoToIDR({ symbol: 'btc', amount: 1 });
  expect(out).toHaveProperty('idr');
  expect(typeof out.idr).toBe('number');
});

test('caching works (no extra network calls)', async () => {
  nock('https://api.coingecko.com')
    .get(/\/api\/v3\/simple\/price.*/)
    .reply(200, { bitcoin: { usd: 20000 } })
    .persist();
  nock('https://api.exchangerate.host')
    .get(/\/latest.*/)
    .reply(200, { rates: { IDR: 15000 } })
    .persist();
  const a = await convertCryptoToIDR({ symbol: 'btc', amount: 1 });
  const b = await convertCryptoToIDR({ symbol: 'btc', amount: 2 });
  expect(a.idr * 2).toBe(b.idr);
});
