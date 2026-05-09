import { arrayDiffMap, arrayDiffSet } from '../2_array_diff_function.js';

test('example input from PDF', () => {
  const a = [1,3,5,7,9];
  const b = [1,2,3,4];
  const outMap = arrayDiffMap(a,b);
  const outSet = arrayDiffSet(a,b);
  expect(outMap).toEqual([2,4,5,7,9]);
  expect(outSet).toEqual([2,4,5,7,9]);
});

test('duplicates handled by both implementations (count diffs)', () => {
  const a = [1,2,2,3];
  const b = [2,4];
  expect(arrayDiffMap(a,b)).toEqual([1,2,3,4]);
  expect(arrayDiffSet(a,b)).toEqual([1,2,3,4]);
});

test('empty arrays', () => {
  expect(arrayDiffMap([], [])).toEqual([]);
  expect(arrayDiffSet([], [])).toEqual([]);
});

test('identical arrays', () => {
  const a = [1,2,3];
  const b = [1,2,3];
  expect(arrayDiffMap(a,b)).toEqual([]);
  expect(arrayDiffSet(a,b)).toEqual([]);
});

test('all duplicates', () => {
  const a = [2,2,2];
  const b = [2,2];
  expect(arrayDiffMap(a,b)).toEqual([2]);
  expect(arrayDiffSet(a,b)).toEqual([2]);
});

test('both implementations agree on multiple inputs', () => {
  const cases = [
    {a: [1,1,2,3], b: [1,2]},
    {a: [5,5,5,6], b: [5,6,6]},
    {a: [7,8,9], b: [8,9,10]},
  ];
  for (const c of cases) {
    expect(arrayDiffMap(c.a, c.b)).toEqual(arrayDiffSet(c.a, c.b));
  }
});