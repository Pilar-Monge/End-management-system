import { describe, expect, test, vi } from 'vitest';
import type { DataSource } from 'typeorm';

import { NotificationService } from '../src/modules/notification/notification.service';

describe('Notification email payload camp name masking', () => {
  test('replaces campId values with campName in email payload', async () => {
    const notificationRepository = {
      findUserById: vi.fn().mockResolvedValue({ id: 11, campId: 1, email: 'admin@camp1.com' }),
      create: vi.fn().mockResolvedValue({ id: 999 }),
      findById: vi.fn(),
      findAllAndCount: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      findActiveUsersByCampAndRoles: vi.fn(),
    };

    const enqueue = vi.fn().mockResolvedValue(undefined);
    const emailOutboxService = {
      enqueue,
    };

    const dataSource = {
      getRepository: vi.fn().mockImplementation(() => ({
        exist: vi.fn().mockResolvedValue(true),
        findOne: vi.fn().mockResolvedValue({ name: 'Campamento Aurora' }),
      })),
    } as unknown as DataSource;

    const systemTimeService = { now: vi.fn(() => new Date()) };

    const service = new NotificationService(
      notificationRepository as never,
      dataSource,
      emailOutboxService as never,
      systemTimeService as never,
    );

    await service.notifyUser(11, {
      campId: 1,
      type: 'ADMISSION_REQUEST_APPROVED',
      title: 'Solicitud aprobada',
      message: 'La solicitud fue aprobada.',
      email: {
        payload: {
          campId: 1,
          originCampId: 1,
          destinationCampId: 2,
          changedFields: [
            { field: 'campId', previous: 1, current: 2 },
            { field: 'originCampId', previous: '1', current: '2' },
            { field: 'destinationCampId', previous: 1, current: 2 },
          ],
          details: {
            campId: 1,
            originCampId: 1,
            destinationCampId: 2,
            changedFields: [{ field: 'campId', previous: 1, current: 2 }],
          },
        },
      },
    });

    expect(enqueue).toHaveBeenCalledTimes(1);
    const sent = enqueue.mock.calls[0][0];
    const payload = sent.payload as Record<string, unknown>;
    const details = payload.details as Record<string, unknown>;
    const changedFields = payload.changedFields as Array<Record<string, unknown>>;
    const detailChangedFields = details.changedFields as Array<Record<string, unknown>>;

    expect(payload.campName).toBe('Campamento Aurora');
    expect(payload.originCampName).toBe('Campamento Aurora');
    expect(payload.destinationCampName).toBe('Campamento Aurora');
    expect(payload.campId).toBeUndefined();
    expect(payload.originCampId).toBeUndefined();
    expect(payload.destinationCampId).toBeUndefined();

    expect(details.campName).toBe('Campamento Aurora');
    expect(details.originCampName).toBe('Campamento Aurora');
    expect(details.destinationCampName).toBe('Campamento Aurora');
    expect(details.campId).toBeUndefined();
    expect(details.originCampId).toBeUndefined();
    expect(details.destinationCampId).toBeUndefined();

    expect(changedFields[0]?.field).toBe('campName');
    expect(changedFields[0]?.previous).toBe('Campamento Aurora');
    expect(changedFields[0]?.current).toBe('Campamento Aurora');
    expect(changedFields[1]?.field).toBe('originCampName');
    expect(changedFields[2]?.field).toBe('destinationCampName');

    expect(detailChangedFields[0]?.field).toBe('campName');
    expect(detailChangedFields[0]?.previous).toBe('Campamento Aurora');
    expect(detailChangedFields[0]?.current).toBe('Campamento Aurora');
  });
});
