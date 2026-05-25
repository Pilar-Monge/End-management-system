function flipObject<T extends Record<string, any>>(o: T) {
  const res: Record<string, string> = {};
  for (const k of Object.keys(o)) res[String((o as any)[k])] = k;
  return res;
}

function range(n: number) {
  return Array.from({ length: n }, (_, i) => i);
}

describe('generated bulk6 - misc', () => {
  it('flipObject inverts keys and values', () => {
    const obj = { a: '1', b: '2' };
    const flipped = flipObject(obj);
    expect(flipped['1']).toBe('a');
    expect(flipped['2']).toBe('b');
  });

  it('range creates expected sequence', () => {
    expect(range(0)).toEqual([]);
    expect(range(3)).toEqual([0, 1, 2]);
  });

  it('bulk assertions for range sums', () => {
    for (let n = 0; n < 200; n++) {
      const r = range(n);
      const s = r.reduce((a, b) => a + b, 0);
      const expected = (n * (n - 1)) / 2;
      expect(s).toBeCloseTo(expected);
    }
  });
});
