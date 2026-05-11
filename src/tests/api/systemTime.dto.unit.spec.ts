import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { AdvanceSystemTimeDto, TimeUnit } from '../../modules/systemTime/dto/advance-system-time.dto';

describe('AdvanceSystemTimeDto (Validation unit tests)', () => {
  describe('TimeUnit enum', () => {
    it('contains HOURS', () => {
      expect(TimeUnit.HOURS).toBe('hours');
    });

    it('contains MINUTES', () => {
      expect(TimeUnit.MINUTES).toBe('minutes');
    });

    it('only contains 2 values', () => {
      const values = Object.values(TimeUnit);
      expect(values.length).toBe(2);
    });
  });

  describe('AdvanceSystemTimeDto validation', () => {
    it('accepts valid hours unit with positive amount', async () => {
      const dto = plainToClass(AdvanceSystemTimeDto, {
        unit: 'hours',
        amount: 1,
      });

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('accepts valid minutes unit with positive amount', async () => {
      const dto = plainToClass(AdvanceSystemTimeDto, {
        unit: 'minutes',
        amount: 30,
      });

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('rejects invalid unit', async () => {
      const dto = plainToClass(AdvanceSystemTimeDto, {
        unit: 'days',
        amount: 1,
      });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('unit');
    });

    it('rejects zero amount', async () => {
      const dto = plainToClass(AdvanceSystemTimeDto, {
        unit: 'hours',
        amount: 0,
      });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('amount');
    });

    it('rejects negative amount', async () => {
      const dto = plainToClass(AdvanceSystemTimeDto, {
        unit: 'hours',
        amount: -5,
      });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
    });

    it('rejects non-numeric amount', async () => {
      const dto = plainToClass(AdvanceSystemTimeDto, {
        unit: 'hours',
        amount: 'invalid',
      });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
    });

    it('rejects missing unit', async () => {
      const dto = plainToClass(AdvanceSystemTimeDto, {
        amount: 1,
      });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
    });

    it('rejects missing amount', async () => {
      const dto = plainToClass(AdvanceSystemTimeDto, {
        unit: 'hours',
      });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
    });

    it('accepts fractional amounts', async () => {
      const dto = plainToClass(AdvanceSystemTimeDto, {
        unit: 'hours',
        amount: 1.5,
      });

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('accepts very small positive amounts', async () => {
      const dto = plainToClass(AdvanceSystemTimeDto, {
        unit: 'minutes',
        amount: 0.01,
      });

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('accepts large amounts', async () => {
      const dto = plainToClass(AdvanceSystemTimeDto, {
        unit: 'hours',
        amount: 8760, 
      });

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('rejects case-sensitive unit mismatch', async () => {
      const dto = plainToClass(AdvanceSystemTimeDto, {
        unit: 'HOURS',
        amount: 1,
      });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
    });

    it('rejects null values', async () => {
      const dto = plainToClass(AdvanceSystemTimeDto, {
        unit: null,
        amount: null,
      });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
    });

    it('rejects undefined values', async () => {
      const dto = plainToClass(AdvanceSystemTimeDto, {
        unit: undefined,
        amount: undefined,
      });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
    });

    it('rejects extra properties (but they are ignored)', async () => {
      const dto = plainToClass(AdvanceSystemTimeDto, {
        unit: 'hours',
        amount: 1,
        extraField: 'should not affect validation',
      });

      const errors = await validate(dto);
      
      expect(errors).toHaveLength(0);
    });

    it('rejects object as amount', async () => {
      const dto = plainToClass(AdvanceSystemTimeDto, {
        unit: 'hours',
        amount: { value: 1 },
      });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
    });

    it('rejects array as amount', async () => {
      const dto = plainToClass(AdvanceSystemTimeDto, {
        unit: 'hours',
        amount: [1],
      });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
    });

    it('rejects boolean as unit', async () => {
      const dto = plainToClass(AdvanceSystemTimeDto, {
        unit: true,
        amount: 1,
      });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
    });
  });

  describe('Edge cases', () => {
    it('accepts minimum valid amount (0.01)', async () => {
      const dto = plainToClass(AdvanceSystemTimeDto, {
        unit: 'minutes',
        amount: 0.01,
      });

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('accepts exact 0.01 minimum', async () => {
      const dto = plainToClass(AdvanceSystemTimeDto, {
        unit: 'hours',
        amount: 0.01,
      });

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('rejects values just below minimum (0.009)', async () => {
      const dto = plainToClass(AdvanceSystemTimeDto, {
        unit: 'hours',
        amount: 0.009,
      });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
    });

    it('handles scientific notation numbers', async () => {
      const dto = plainToClass(AdvanceSystemTimeDto, {
        unit: 'hours',
        amount: 1e3, 
      });

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('handles very precise decimals', async () => {
      const dto = plainToClass(AdvanceSystemTimeDto, {
        unit: 'minutes',
        amount: 1.123456789,
      });

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });
  });
});
