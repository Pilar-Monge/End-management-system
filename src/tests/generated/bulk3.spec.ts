function debounce(fn: (...args: any[]) => void, wait = 10) {
  let t: NodeJS.Timeout | null = null;
  return (...args: any[]) => {
    if (t) clearTimeout(t);
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    t = setTimeout(() => fn(...args), wait);
  };
}

function throttle(fn: (...args: any[]) => void, wait = 10) {
  let last = 0;
  return (...args: any[]) => {
    const now = Date.now();
    if (now - last >= wait) {
      last = now;
      fn(...args);
    }
  };
}

describe('generated bulk3 - timing helpers', () => {
  jest.useFakeTimers();

  it('debounce calls function once for rapid calls', () => {
    const fn = jest.fn();
    const d = debounce(fn, 50);
    d(1);
    d(2);
    d(3);
    jest.advanceTimersByTime(60);
    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).toHaveBeenCalledWith(3);
  });

  it('throttle allows spaced calls', () => {
    const fn = jest.fn();
    const t = throttle(fn, 20);
    t(1);
    t(2);
    jest.advanceTimersByTime(25);
    t(3);
    expect(fn).toHaveBeenCalledTimes(2);
  });

  it('bulk timer checks for stability', () => {
    const fn = jest.fn();
    const d2 = debounce(fn, 5);
    for (let i = 0; i < 10; i++) d2(i);
    jest.advanceTimersByTime(10);
    expect(fn).toHaveBeenCalledTimes(1);
  });
});
