// 3_crypto_to_idr_converter.js
// Converts a crypto amount to IDR using public APIs with 1-minute caching

const axios = require('axios');

// Simple in-memory cache: { key -> { ts, data } }
const cache = new Map();
const CACHE_TTL_MS = 60 * 1000;

async function fetchCryptoUSD(symbol) {
  // Use CoinGecko public API (no API key) for crypto prices in USD (coingecko ids are lowercase)
  const key = `crypto-${symbol}-usd`;
  const now = Date.now();
  if (cache.has(key)) {
    const entry = cache.get(key);
    if (now - entry.ts < CACHE_TTL_MS) return entry.data;
  }
  const api = `https://api.coingecko.com/api/v3/simple/price?ids=${encodeURIComponent(symbol)}&vs_currencies=usd`;
  const resp = await axios.get(api, { timeout: 5000 });
  if (!resp.data || !resp.data[symbol] || resp.data[symbol].usd == null) throw new Error('unsupported currency or invalid response');
  cache.set(key, { ts: now, data: resp.data[symbol].usd });
  return resp.data[symbol].usd;
}

async function fetchUsdToIdr() {
  const key = 'usd-idr';
  const now = Date.now();
  if (cache.has(key)) {
    const entry = cache.get(key);
    if (now - entry.ts < CACHE_TTL_MS) return entry.data;
  }
  // Use exchangerate.host which provides free rates without API key
  const resp = await axios.get('https://api.exchangerate.host/latest?base=USD&symbols=IDR', { timeout: 5000 });
  if (!resp.data || !resp.data.rates || resp.data.rates.IDR == null) throw new Error('invalid exchange response');
  cache.set(key, { ts: now, data: resp.data.rates.IDR });
  return resp.data.rates.IDR;
}

async function convertCryptoToIDR({ symbol, amount }) {
  if (!symbol) throw new Error('symbol required');
  if (amount == null) throw new Error('amount required');
  // CoinGecko uses ids (e.g., bitcoin, ethereum, dogecoin). Accept common symbols and map them.
  const symbolMap = { btc: 'bitcoin', eth: 'ethereum', doge: 'dogecoin' };
  const id = (symbolMap[symbol.toLowerCase()] || symbol.toLowerCase());
  const usdPrice = await fetchCryptoUSD(id);
  const usdToIdr = await fetchUsdToIdr();
  const idr = Math.round(usdPrice * amount * usdToIdr);
  return { crypto: symbol.toUpperCase(), amount, idr };
}

module.exports = { convertCryptoToIDR, _private: { cache } };
