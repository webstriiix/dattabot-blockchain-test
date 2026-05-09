// Express server exposing /array-diff POST endpoint
// Accepts JSON { a: [...], b: [...] } and query param impl=map|set to choose implementation
import express from 'express';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { arrayDiffMap, arrayDiffSet } from '../2_array_diff_function.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
app.use(express.json());

app.post('/array-diff', (req, res) => {
  const a = req.body.a || [];
  const b = req.body.b || [];
  const impl = (req.query.impl || 'map').toLowerCase();
  try {
    let result;
    if (impl === 'set') result = arrayDiffSet(a, b);
    else result = arrayDiffMap(a, b);
    res.json({ result });
  } catch (err) {
    res.status(400).json({ error: String(err) });
  }
});

const port = process.env.PORT || 8080;
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  app.listen(port, () => console.log(`array-diff server listening ${port}`));
}

export default app;
