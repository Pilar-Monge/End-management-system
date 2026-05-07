function isEven(n: number) {
  return n % 2 === 0;
}
function sum(...nums: number[]) {
  return nums.reduce((a, b) => a + b, 0);
}

describe('generated bulk1 - numbers', () => {
  it('isEven returns true for even numbers', () => {
    expect(isEven(0)).toBe(true);
    expect(isEven(2)).toBe(true);
    expect(isEven(-4)).toBe(true);
    expect(isEven(101)).toBe(false);
  });

  it('sum returns correct value for positive numbers', () => {
    expect(sum(1, 2, 3)).toBe(6);
    expect(sum(10)).toBe(10);
    expect(sum()).toBe(0);
  });

  it('sum handles negative numbers', () => {
    expect(sum(-1, -2, 3)).toBe(0);
    expect(sum(-5, 5)).toBe(0);
  });

  it('bulk numeric checks', () => {
    for (let i = 0; i < 50; i++) {
      const a = i;
      const b = i * 2;
      expect(sum(a, b)).toBe(a + b);
      expect(isEven(b)).toBe(true);
    }
  });
});
