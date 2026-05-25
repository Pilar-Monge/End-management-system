import { SystemTimeController } from '../../modules/systemTime/systemTime.controller';
import { BadRequestException, Logger } from '@nestjs/common';

describe('SystemTimeController (API controller unit tests)', () => {
  let controller: SystemTimeController;
  let mockService: any;
  let mockModuleRef: any;
  let mockExpeditionRepo: any;
  let mockSessionRepo: any;
  let mockPasswordTokenRepo: any;

  beforeEach(() => {
    jest.spyOn(Logger.prototype, 'debug').mockImplementation(() => {});
    jest.spyOn(Logger.prototype, 'warn').mockImplementation(() => {});
    jest.spyOn(Logger.prototype, 'error').mockImplementation(() => {});

    mockService = {
      getServerTime: jest.fn().mockReturnValue({ serverTime: '2026-01-01T00:00:00.000Z' }),
      now: jest.fn().mockReturnValue(new Date('2026-01-01T00:00:00.000Z')),
      getOffset: jest.fn().mockReturnValue(0),
      addOffset: jest.fn().mockReturnValue({
        offset: 3600000,
        newTime: '2026-01-01T01:00:00.000Z',
      }),
      resetOffset: jest.fn(),
    };

    mockModuleRef = {
      get: jest.fn().mockReturnValue(null),
    };

    mockExpeditionRepo = {
      find: jest.fn().mockResolvedValue([]),
      update: jest.fn().mockResolvedValue({ affected: 0 }),
    };

    mockSessionRepo = {
      find: jest.fn().mockResolvedValue([]),
      update: jest.fn().mockResolvedValue({ affected: 0 }),
    };

    mockPasswordTokenRepo = {
      find: jest.fn().mockResolvedValue([]),
      update: jest.fn().mockResolvedValue({ affected: 0 }),
    };

    controller = new SystemTimeController(
      mockService,
      mockModuleRef,
      mockExpeditionRepo,
      mockSessionRepo,
      mockPasswordTokenRepo,
    );
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('getServerTime()', () => {
    it('returns service output', () => {
      const result = controller.getServerTime();
      expect(result).toEqual({ serverTime: '2026-01-01T00:00:00.000Z' });
    });

    it('calls service getServerTime method', () => {
      controller.getServerTime();
      expect(mockService.getServerTime).toHaveBeenCalled();
    });

    it('returns valid response structure', () => {
      const result = controller.getServerTime();
      expect(result).toHaveProperty('serverTime');
      expect(typeof result.serverTime).toBe('string');
    });
  });

  describe('getOffset()', () => {
    it('returns object with success and data properties', () => {
      const result = controller.getOffset();
      expect(result).toHaveProperty('success');
      expect(result).toHaveProperty('data');
    });

    it('success is always true', () => {
      const result = controller.getOffset();
      expect(result.success).toBe(true);
    });

    it('data contains offsetMilliseconds', () => {
      const result = controller.getOffset();
      expect(result.data).toHaveProperty('offsetMilliseconds');
      expect(typeof result.data.offsetMilliseconds).toBe('number');
    });

    it('data contains currentSystemTime ISO string', () => {
      const result = controller.getOffset();
      expect(result.data).toHaveProperty('currentSystemTime');
      expect(result.data.currentSystemTime).toMatch(
        /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/,
      );
    });

    it('calls service methods', () => {
      controller.getOffset();
      expect(mockService.getOffset).toHaveBeenCalled();
      expect(mockService.now).toHaveBeenCalled();
    });
  });

  describe('advanceSystemTime() - Input validation', () => {
    it('throws BadRequestException for invalid unit', async () => {
      const dto = { unit: 'invalid', amount: 1 };
      await expect(controller.advanceSystemTime(dto as any)).rejects.toThrow(BadRequestException);
    });

    it('throws BadRequestException for zero amount', async () => {
      const dto = { unit: 'hours', amount: 0 };
      await expect(controller.advanceSystemTime(dto as any)).rejects.toThrow(BadRequestException);
    });

    it('throws BadRequestException for negative amount', async () => {
      const dto = { unit: 'hours', amount: -1 };
      await expect(controller.advanceSystemTime(dto as any)).rejects.toThrow(BadRequestException);
    });
  });

  describe('advanceSystemTime() - Success cases', () => {
    it('accepts hours unit with positive amount', async () => {
      const dto = { unit: 'hours', amount: 1 };
      mockService.addOffset.mockReturnValue({
        offset: 3600000,
        newTime: '2026-01-01T01:00:00.000Z',
      });
      const result = await controller.advanceSystemTime(dto as any);
      expect(result.success).toBe(true);
    });

    it('accepts minutes unit with positive amount', async () => {
      const dto = { unit: 'minutes', amount: 30 };
      mockService.addOffset.mockReturnValue({
        offset: 1800000,
        newTime: '2026-01-01T00:30:00.000Z',
      });
      const result = await controller.advanceSystemTime(dto as any);
      expect(result.success).toBe(true);
    });

    it('converts hours to milliseconds correctly', async () => {
      const dto = { unit: 'hours', amount: 2 };
      mockService.addOffset.mockReturnValue({
        offset: 7200000,
        newTime: '2026-01-01T02:00:00.000Z',
      });
      const result = await controller.advanceSystemTime(dto as any);
      expect(mockService.addOffset).toHaveBeenCalledWith(7200000);
    });

    it('converts minutes to milliseconds correctly', async () => {
      const dto = { unit: 'minutes', amount: 45 };
      mockService.addOffset.mockReturnValue({
        offset: 2700000,
        newTime: '2026-01-01T00:45:00.000Z',
      });
      const result = await controller.advanceSystemTime(dto as any);
      expect(mockService.addOffset).toHaveBeenCalledWith(2700000);
    });

    it('returns correct structure with success, data, and message', async () => {
      const dto = { unit: 'hours', amount: 1 };
      mockService.addOffset.mockReturnValue({
        offset: 3600000,
        newTime: '2026-01-01T01:00:00.000Z',
      });
      const result = await controller.advanceSystemTime(dto as any);
      expect(result).toHaveProperty('success');
      expect(result).toHaveProperty('data');
      expect(result).toHaveProperty('message');
    });

    it('includes automations array in response', async () => {
      const dto = { unit: 'hours', amount: 1 };
      mockService.addOffset.mockReturnValue({
        offset: 3600000,
        newTime: '2026-01-01T01:00:00.000Z',
      });
      const result = await controller.advanceSystemTime(dto as any);
      expect(result.data).toHaveProperty('automations');
      expect(Array.isArray(result.data.automations)).toBe(true);
    });

    it('accepts fractional amounts', async () => {
      const dto = { unit: 'hours', amount: 1.5 };
      mockService.addOffset.mockReturnValue({
        offset: 5400000,
        newTime: '2026-01-01T01:30:00.000Z',
      });
      const result = await controller.advanceSystemTime(dto as any);
      expect(result.success).toBe(true);
      expect(mockService.addOffset).toHaveBeenCalledWith(5400000);
    });

    it('generates appropriate success message', async () => {
      const dto = { unit: 'hours', amount: 2 };
      mockService.addOffset.mockReturnValue({
        offset: 7200000,
        newTime: '2026-01-01T02:00:00.000Z',
      });
      const result = await controller.advanceSystemTime(dto as any);
      expect(result.message).toContain('2');
      expect(result.message).toContain('hour');
    });
  });
});
