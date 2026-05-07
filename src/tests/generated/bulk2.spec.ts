function chunk<T>(arr: T[], size: number) {
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

function unique<T>(arr: T[]) {
  return Array.from(new Set(arr));
}

describe('generated bulk2 - arrays', () => {
  it('chunk splits array into sizes', () => {
    expect(chunk([1, 2, 3, 4], 2)).toEqual([
      [1, 2],
      [3, 4],
    ]);
    expect(chunk([1, 2, 3], 2)).toEqual([[1, 2], [3]]);
    expect(chunk([], 3)).toEqual([]);
  });

  it('unique returns unique values', () => {
    expect(unique([1, 2, 2, 3])).toEqual([1, 2, 3]);
    expect(unique(['a', 'a', 'b'])).toEqual(['a', 'b']);
  });

  it('bulk array property tests', () => {
    const arr = Array.from({ length: 100 }, (_, i) => i % 10);
    const u = unique(arr);
    expect(u.length).toBe(10);
    const chunks = chunk(arr, 7);
    expect(chunks.reduce((s, c) => s + c.length, 0)).toBe(arr.length);
  });
});
