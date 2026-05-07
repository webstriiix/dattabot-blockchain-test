// 1_print_dattabot.js
// Implements printing numbers 1..n with rules from PDF.
// Supports two Fibonacci modes: "pdf" (match PDF's interpretation) and "standard" (1,1,2,3,5,...).

function isPrime(n) {
  if (n <= 1) return false;
  if (n <= 3) return true;
  if (n % 2 === 0) return false;
  const r = Math.floor(Math.sqrt(n));
  for (let i = 3; i <= r; i += 2) if (n % i === 0) return false;
  return true;
}

// Standard Fibonacci detection: precompute set up to n
function fibSetStandard(n) {
  const s = new Set();
  let a = 1, b = 1;
  s.add(1);
  while (b <= n) {
    s.add(b);
    const c = a + b; a = b; b = c;
  }
  return s;
}

// "PDF" Fibonacci detection: The PDF example marks 2 and 3 and 8 and 13 as bot; it also shows 1 treated as number and sometimes as dattabot.
// To support both, the "pdf" mode uses the following heuristic to match example output: treat Fibonacci numbers as {2,3,8,13,21,...}
// (i.e., exclude 1). This is intentionally non-standard and provided so results can reproduce the PDF example exactly.
function fibSetPdf(n) {
  const s = new Set();
  let a = 1, b = 1;
  while (b <= n) {
    if (b !== 1) s.add(b); // exclude 1 to match PDF example
    const c = a + b; a = b; b = c;
  }
  return s;
}

/**
 * printDattabot(n, opts)
 * opts:
 *  - fibMode: 'standard' or 'pdf' (default 'standard')
 * Returns an array (not string) as required; caller can JSON.stringify it.
 *
 * Time complexity: prime checking runs in O(n*sqrt(n)) using trial division with skipping evens.
 * Efficient prime detection note: for this n-range typical optimization is to use Sieve of Eratosthenes (O(n log log n)).
 * Here trial-division with sqrt(n) is used for clarity; for large n replace isPrime and precompute primes using sieve.
 */
function printDattabot(n, opts = {}) {
  const fibMode = opts.fibMode || 'standard';
  const fibSet = fibMode === 'pdf' ? fibSetPdf(n) : fibSetStandard(n);
  const out = [];
  for (let i = 1; i <= n; i++) {
    const prime = isPrime(i);
    const fib = fibSet.has(i);
    if (prime && fib) out.push('dattabot');
    else if (prime) out.push('datta');
    else if (fib) out.push('bot');
    else out.push(i);
  }
  return out;
}

module.exports = { printDattabot, isPrime, fibSetStandard, fibSetPdf };
