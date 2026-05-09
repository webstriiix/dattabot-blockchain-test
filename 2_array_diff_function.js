// 2_array_diff_function.js
// Two implementations of symmetric difference (elements in either a or b but not both)

// Implementation A: using frequency maps to handle duplicates accurately
export function arrayDiffMap(a, b) {
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

// Implementation B: canceling occurrences approach (handles duplicates)
// This implementation preserves counts by removing matched occurrences from a copy
// of the other array. It's intentionally different from the frequency-map approach
// (arrayDiffMap) to show an alternative algorithmic trade-off: simpler to reason
// about but O(n*m) in worst case (indexOf inside loop). It still returns a sorted
// array for deterministic output.
export function arrayDiffSet(a, b) {
  // Work on copies to avoid mutating inputs
  const bCopy = b.slice();
  const result = [];
  for (const x of a) {
    const idx = bCopy.indexOf(x);
    if (idx === -1) result.push(x);
    else bCopy.splice(idx, 1); // cancel one occurrence
  }
  // remaining items in bCopy are those not matched by a
  result.push(...bCopy);
  // deterministic sorted output
  return result.sort((p, q) => (p < q ? -1 : p > q ? 1 : 0));
}