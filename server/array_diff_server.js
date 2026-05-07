// Express server exposing /array-diff POST endpoint
// Accepts JSON { a: [...], b: [...] } and query param impl=map|set to choose implementation
const express = require('express');
const bodyParser = require('body-parser');
const { arrayDiffMap, arrayDiffSet } = require('../2_array_diff_function');
const app = express();
app.use(bodyParser.json());

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

const port = process.env.PORT || 3000;
if (require.main === module) {
  app.listen(port, () => console.log(`array-diff server listening ${port}`));
}
module.exports = app;
