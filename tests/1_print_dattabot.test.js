import { printDattabot } from '../1_print_dattabot.js';

test('n=15 output (pdf mode) with real primality', () => {
  // PDF example is inconsistent; pdf mode now uses real primality but a custom fib set to reproduce
  // positions where the PDF marked 'bot'. Expected output reflects that choice.
  const expected = [1, 'dattabot', 'dattabot', 4, 'datta', 'bot', 'datta', 8, 9, 'bot', 'datta', 12, 'datta', 'bot', 15];
  const out = printDattabot(15, { fibMode: 'pdf' });
  expect(out).toEqual(expected);
});

test('n=30 spot checks (standard fib mode)', () => {
  const out = printDattabot(30, { fibMode: 'standard' });
  // 13 is prime and fib -> dattabot
  expect(out[12]).toBe('dattabot'); // 13
  // 21 is a Fibonacci number
  expect(out[20]).toBe('bot'); // 21
  // 29 is prime -> datta
  expect(out[28]).toBe('datta'); // 29
});

test('n=50 spot checks (standard fib mode)', () => {
  const out = printDattabot(50, { fibMode: 'standard' });
  // 2 is both -> dattabot
  expect(out[1]).toBe('dattabot'); // 2
  // 5 is both -> dattabot (standard fib)
  expect(out[4]).toBe('dattabot'); // 5
  // 8 is fib only -> bot
  expect(out[7]).toBe('bot'); // 8
  // 11 is prime -> datta
  expect(out[10]).toBe('datta'); // 11
});