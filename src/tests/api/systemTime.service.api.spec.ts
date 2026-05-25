import { SystemTimeService } from '../../modules/systemTime/systemTime.service';

describe('SystemTimeService (API unit tests)', () => {
  let service: SystemTimeService;

  beforeEach(() => {
    service = new SystemTimeService();
  });

  describe('now()', () => {
    it('returns a Date instance', () => {
      const result = service.now();
      expect(result).toBeInstanceOf(Date);
    });

    it('returns current time within reasonable range', () => {
      const before = Date.now();
      const result = service.now();
      const after = Date.now();
      expect(result.getTime()).toBeGreaterThanOrEqual(before);
      expect(result.getTime()).toBeLessThanOrEqual(after);
    });

    it('returns different times on subsequent calls', (done) => {
      const first = service.now();
      setTimeout(() => {
        const second = service.now();
        expect(second.getTime()).toBeGreaterThan(first.getTime());
        done();
      }, 10);
    });
  });

  describe('nowIso()', () => {
    it('returns ISO string format', () => {
      const result = service.nowIso();
      expect(result).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
    });

    it('returns valid ISO string', () => {
      const result = service.nowIso();
      const date = new Date(result);
      expect(date).toBeInstanceOf(Date);
      expect(!isNaN(date.getTime())).toBe(true);
    });

    it('includes milliseconds in ISO output', () => {
      const result = service.nowIso();
      expect(result).toContain('.');
    });

    it('returns ISO string ending with Z', () => {
      const result = service.nowIso();
      expect(result.endsWith('Z')).toBe(true);
    });
  });

  describe('getServerTime()', () => {
    it('returns object with serverTime property', () => {
      const result = service.getServerTime();
      expect(result).toHaveProperty('serverTime');
    });

    it('serverTime is ISO string', () => {
      const result = service.getServerTime();
      expect(result.serverTime).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
    });

    it('serverTime matches nowIso output', () => {
      const isoTime = service.nowIso();
      const serverTime = service.getServerTime().serverTime;
      // They should be very close (within same millisecond or adjacent one)
      const isoDate = new Date(isoTime);
      const serverDate = new Date(serverTime);
      const diff = Math.abs(isoDate.getTime() - serverDate.getTime());
      expect(diff).toBeLessThan(10);
    });

    it('returns valid ServerTimeResponse type', () => {
      const result = service.getServerTime();
      expect(typeof result).toBe('object');
      expect(typeof result.serverTime).toBe('string');
    });

    it('serverTime is valid parseable date', () => {
      const result = service.getServerTime();
      const date = new Date(result.serverTime);
      expect(isNaN(date.getTime())).toBe(false);
    });
  });

  describe('Integration tests', () => {
    it('now() time converts to same ISO string', () => {
      const nowDate = service.now();
      const isoString = service.nowIso();
      const parsedDate = new Date(isoString);
      // Should be within 1 second
      const diff = Math.abs(nowDate.getTime() - parsedDate.getTime());
      expect(diff).toBeLessThan(1000);
    });

    it('sequence: now -> nowIso -> getServerTime maintains time order', (done) => {
      const now1 = service.now().getTime();
      const iso = service.nowIso();
      const server = service.getServerTime().serverTime;
      const now2 = service.now().getTime();

      const isoTime = new Date(iso).getTime();
      const serverTime = new Date(server).getTime();

      expect(isoTime).toBeGreaterThanOrEqual(now1);
      expect(serverTime).toBeGreaterThanOrEqual(now1);
      expect(now2).toBeGreaterThanOrEqual(isoTime);
      done();
    });

    it('handles rapid consecutive calls', () => {
      const times = [];
      for (let i = 0; i < 10; i++) {
        times.push(service.now().getTime());
      }
      // Each call should return same or newer time
      for (let i = 1; i < times.length; i++) {
        expect(times[i]).toBeGreaterThanOrEqual(times[i - 1]);
      }
    });
  });
});
