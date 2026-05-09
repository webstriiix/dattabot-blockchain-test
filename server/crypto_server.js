import express from 'express';
import dotenv from 'dotenv';
import { convertCryptoToIDR, _private } from '../3_crypto_to_idr_converter.js';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
app.use(express.json());

const port = process.env.PORT_CRYPTO || 3000;
// TTL duplicated here to report caching status in responses
const CACHE_TTL_MS = 60 * 1000;

const symbolMap = { btc: 'bitcoin', eth: 'ethereum', doge: 'dogecoin' };

function checkCached(id) {
  const now = Date.now();
  const cryptoKey = `crypto-${id}-usd`;
  const cEntry = _private.cache.get(cryptoKey);
  const usdEntry = _private.cache.get('usd-idr');
  const cachedCrypto = !!(cEntry && (now - cEntry.ts < CACHE_TTL_MS));
  const cachedUsd = !!(usdEntry && (now - usdEntry.ts < CACHE_TTL_MS));
  return { cachedCrypto, cachedUsd };
}

app.get('/convert', async (req, res) => {
  const { symbol, amount } = req.query;
  if (!symbol || amount == null) return res.status(400).json({ error: 'symbol and amount query parameters required' });
  try {
    const amt = Number(amount);
    if (Number.isNaN(amt)) return res.status(400).json({ error: 'amount must be a number' });
    const id = (symbolMap[symbol.toLowerCase()] || symbol.toLowerCase());
    const cacheInfo = checkCached(id);
    const out = await convertCryptoToIDR({ symbol, amount: amt });
    res.json({ ...out, ...cacheInfo });
  } catch (err) {
    console.error('convert error', err.message || err);
    res.status(502).json({ error: err.message || 'conversion failed' });
  }
});

app.post('/convert', async (req, res) => {
  const { symbol, amount } = req.body || {};
  if (!symbol || amount == null) return res.status(400).json({ error: 'symbol and amount required in JSON body' });
  try {
    const amt = Number(amount);
    if (Number.isNaN(amt)) return res.status(400).json({ error: 'amount must be a number' });
    const id = (symbolMap[symbol.toLowerCase()] || symbol.toLowerCase());
    const cacheInfo = checkCached(id);
    const out = await convertCryptoToIDR({ symbol, amount: amt });
    res.json({ ...out, ...cacheInfo });
  } catch (err) {
    console.error('convert error', err.message || err);
    res.status(502).json({ error: err.message || 'conversion failed' });
  }
});

// Serve a tiny UI if requested
app.use(express.static(join(__dirname, '..', 'frontend-crypto')));

app.listen(port, () => {
  console.log(`Crypto server running: http://localhost:${port}`);
});
