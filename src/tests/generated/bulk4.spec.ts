function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

function merge(a: Record<string, any>, b: Record<string, any>) {
  return { ...a, ...b };
}

describe('generated bulk4 - objects', () => {
  it('deepClone produces equal but not same reference', () => {
    const o = { a: 1, b: { c: 2 } };
    const c = deepClone(o);
    expect(c).toEqual(o);
    expect(c).not.toBe(o);
    (c as any).b.c = 99;
    expect((o as any).b.c).toBe(2);
  });

  it('merge prefers second object keys', () => {
    const a = { x: 1, y: 2 };
    const b = { y: 3, z: 4 };
    const m = merge(a,b);
    expect(m).toEqual({ x:1, y:3, z:4 });
  });

  it('bulk object modifications are isolated', () => {
    const base = { i:0 };
    for (let k=0;k<100;k++) {
      const copy = deepClone(base);
      copy.i = k;
      expect(base.i).toBe(0);
      expect(copy.i).toBe(k);
    }
  });
});
