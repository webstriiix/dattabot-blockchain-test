const { arrayDiffMap, arrayDiffSet } = require('../2_array_diff_function');

test('example input from PDF', () => {
  const a = [1,3,5,7,9];
  const b = [1,2,3,4];
  const outMap = arrayDiffMap(a,b);
  const outSet = arrayDiffSet(a,b);
  expect(outMap.sort()).toEqual([2,4,5,7,9].sort());
  expect(outSet.sort()).toEqual([2,4,5,7,9].sort());
});

test('duplicates handled by map implementation', () => {
  const a = [1,2,2,3];
  const b = [2,4];
  // With duplicates: symmetric difference should include difference in counts and unique items from both arrays
  expect(arrayDiffMap(a,b).sort()).toEqual([1,2,3,4].sort());
});
