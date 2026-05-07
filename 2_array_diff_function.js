// 2_array_diff_function.js
// Two implementations of symmetric difference (elements in either a or b but not both)

// Implementation A: using frequency maps to handle duplicates accurately
function arrayDiffMap(a, b) {
  const freqA = new Map();
  const freqB = new Map();
  for (const x of a) freqA.set(x, (freqA.get(x) || 0) + 1);
  for (const x of b) freqB.set(x, (freqB.get(x) || 0) + 1);
  const result = [];
  // Include absolute difference of counts for each element present in either array
  const keys = new Set([...freqA.keys(), ...freqB.keys()]);
  for (const x of keys) {
    const ca = freqA.get(x) || 0;
    const cb = freqB.get(x) || 0;
    const diff = Math.abs(ca - cb);
    for (let i = 0; i < diff; i++) result.push(x);
  }
  // Sort to provide deterministic output
  return result.sort((p, q) => (p < q ? -1 : p > q ? 1 : 0));
}

// Implementation B: using sets (loses duplicate counts but is fast)
function arrayDiffSet(a, b) {
  const sa = new Set(a);
  const sb = new Set(b);
  const result = [];
  for (const x of sa) if (!sb.has(x)) result.push(x);
  for (const x of sb) if (!sa.has(x)) result.push(x);
  return result.sort((p, q) => (p < q ? -1 : p > q ? 1 : 0));
}

module.exports = { arrayDiffMap, arrayDiffSet };
