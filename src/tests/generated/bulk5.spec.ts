function validateEmail(s: string) {
  return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(s);
}

function parseIntSafe(s: unknown, fallback = 0) {
  const n = Number(s);
  return Number.isFinite(n) ? n : fallback;
}

describe('generated bulk5 - utils', () => {
  it('validateEmail basic cases', () => {
    expect(validateEmail('a@b.com')).toBe(true);
    expect(validateEmail('not-an-email')).toBe(false);
    expect(validateEmail('x@y')).toBe(false);
  });

  it('parseIntSafe returns fallback on NaN', () => {
    expect(parseIntSafe('10')).toBe(10);
    expect(parseIntSafe('abc', 7)).toBe(7);
    expect(parseIntSafe(null)).toBe(0);
  });

  it('bulk email validation loop', () => {
    const good = ['u1@d.com','x@y.io','hello.world@company.co'];
    good.forEach(g=>expect(validateEmail(g)).toBe(true));
    const bad = ['','@','noatsign.com','a@b@c.com'];
    bad.forEach(b=>expect(validateEmail(b)).toBe(false));
  });
});
