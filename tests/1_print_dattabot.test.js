const { printDattabot } = require('../1_print_dattabot');

test('n=15 standard fib mode', () => {
  const out = printDattabot(15, { fibMode: 'standard' });
  expect(Array.isArray(out)).toBe(true);
  expect(out.length).toBe(15);
});

test('n=15 pdf fib mode matches PDF example positions', () => {
  const out = printDattabot(15, { fibMode: 'pdf' });
  // basic sanity: index 2 (value 2) should be "dattabot" in PDF example
  expect(out[1]).toBe('dattabot');
});

test('n=50 runs quickly', () => {
  const out = printDattabot(50, { fibMode: 'standard' });
  expect(out.length).toBe(50);
});
