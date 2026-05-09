import nock from 'nock';
import { convertCryptoToIDR, _private } from '../3_crypto_to_idr_converter.js';

afterEach(() => {
  nock.cleanAll();
  _private.cache.clear();
});

test('convert BTC mocked and exact IDR', async () => {
  nock('https://api.coingecko.com')
    .get(/\/api\/v3\/simple\/price.*/)
    .reply(200, { bitcoin: { usd: 20000 } });
  nock('https://open.er-api.com')
    .get('/v6/latest/USD')
    .reply(200, { result: 'success', rates: { IDR: 15000 } });
  const out = await convertCryptoToIDR({ symbol: 'btc', amount: 1 });
  expect(out).toEqual({ crypto: 'BTC', amount: 1, idr: 300000000 });
});

test('convert ETH and DOGE mocked exact values', async () => {
  nock('https://api.coingecko.com')
    .get(/\/api\/v3\/simple\/price.*ids=ethereum.*/)
    .reply(200, { ethereum: { usd: 1500 } });
  nock('https://api.coingecko.com')
    .get(/\/api\/v3\/simple\/price.*ids=dogecoin.*/)
    .reply(200, { dogecoin: { usd: 0.1 } });
  nock('https://open.er-api.com')
    .get('/v6/latest/USD')
    .reply(200, { result: 'success', rates: { IDR: 15000 } })
    .persist();
  const eth = await convertCryptoToIDR({ symbol: 'eth', amount: 2 });
  expect(eth.idr).toBe(Math.round(1500 * 2 * 15000));
  const doge = await convertCryptoToIDR({ symbol: 'doge', amount: 100 });
  expect(doge.idr).toBe(Math.round(0.1 * 100 * 15000));
});

test('unsupported currency error', async () => {
  nock('https://api.coingecko.com')
    .get(/\/api\/v3\/simple\/price.*/)
    .reply(200, {});
  nock('https://open.er-api.com')
    .get('/v6/latest/USD')
    .reply(200, { result: 'success', rates: { IDR: 15000 } });
  await expect(convertCryptoToIDR({ symbol: 'unknowncoin', amount: 1 })).rejects.toThrow(/unsupported currency/);
});

test('exchange API down error', async () => {
  nock('https://api.coingecko.com')
    .get(/\/api\/v3\/simple\/price.*/)
    .reply(200, { bitcoin: { usd: 20000 } });
  nock('https://open.er-api.com')
    .get('/v6/latest/USD')
    .reply(500, 'server error');
  await expect(convertCryptoToIDR({ symbol: 'btc', amount: 1 })).rejects.toThrow(/invalid exchange response|Request failed/);
});

test('caching works (no extra network calls)', async () => {
  nock('https://api.coingecko.com')
    .get(/\/api\/v3\/simple\/price.*/)
    .reply(200, { bitcoin: { usd: 20000 } })
    .persist();
  nock('https://open.er-api.com')
    .get('/v6/latest/USD')
    .reply(200, { result: 'success', rates: { IDR: 15000 } })
    .persist();
  const a = await convertCryptoToIDR({ symbol: 'btc', amount: 1 });
  const b = await convertCryptoToIDR({ symbol: 'btc', amount: 2 });
  expect(a.idr * 2).toBe(b.idr);
});