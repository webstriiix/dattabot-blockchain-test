// 3_crypto_to_idr_converter.js
// Converts a crypto amount to IDR using public APIs with 1-minute caching

import dotenv from 'dotenv';
dotenv.config();
import axios from 'axios';
import { fileURLToPath } from 'url';

// Simple in-memory cache: { key -> { ts, data } }
const cache = new Map();
const CACHE_TTL_MS = 60 * 1000;

export async function fetchCryptoUSD(symbol) {
  // Use CoinGecko public API for crypto prices in USD (ids are lowercase)
  const key = `crypto-${symbol}-usd`;
  const now = Date.now();
  if (cache.has(key)) {
    const entry = cache.get(key);
    if (now - entry.ts < CACHE_TTL_MS) return entry.data;
  }
  const coingeckoHost = process.env.COINGECKO_HOST || 'https://api.coingecko.com';
  const api = `${coingeckoHost}/api/v3/simple/price?ids=${encodeURIComponent(symbol)}&vs_currencies=usd`;
  const headers = {};
  if (process.env.COINGECKO_API_KEY) headers['Authorization'] = `Bearer ${process.env.COINGECKO_API_KEY}`;
  const resp = await axios.get(api, { timeout: 5000, headers });
  if (!resp.data || !resp.data[symbol] || resp.data[symbol].usd == null) throw new Error('unsupported currency or invalid response');
  cache.set(key, { ts: now, data: resp.data[symbol].usd });
  return resp.data[symbol].usd;
}

export async function fetchUsdToIdr() {
  const key = 'usd-idr';
  const now = Date.now();
  if (cache.has(key)) {
    const entry = cache.get(key);
    if (now - entry.ts < CACHE_TTL_MS) return entry.data;
  }
  // Use open.er-api.com (free) for USD rates
  const openErHost = process.env.OPEN_ER_HOST || 'https://open.er-api.com';
  const api = `${openErHost}/v6/latest/USD`;
  const headers = {};
  if (process.env.OPEN_ER_API_KEY) headers['Authorization'] = `Bearer ${process.env.OPEN_ER_API_KEY}`;
  const resp = await axios.get(api, { timeout: 5000, headers });
  if (!resp.data || !resp.data.rates || resp.data.rates.IDR == null) throw new Error('invalid exchange response');
  cache.set(key, { ts: now, data: resp.data.rates.IDR });
  return resp.data.rates.IDR;
}

export async function convertCryptoToIDR({ symbol, amount }) {
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

// CLI support: --symbol or -s, --amount or -a
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const argv = process.argv.slice(2);
  let symbol = null;
  let amount = null;
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--symbol' || a === '-s') symbol = argv[i+1], i++;
    else if (a === '--amount' || a === '-a') amount = Number(argv[i+1]), i++;
  }
  if (!symbol || amount == null) {
    console.error('Usage: node 3_crypto_to_idr_converter.js --symbol <symbol> --amount <amount>');
    process.exit(1);
  }
  convertCryptoToIDR({ symbol, amount })
    .then(res => console.log(JSON.stringify(res, null, 2)))
    .catch(err => { console.error('Error:', err.message); process.exit(1); });
}

export const _private = { cache };
