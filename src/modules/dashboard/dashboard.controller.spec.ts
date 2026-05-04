import { BadRequestException } from '@nestjs/common';

import { DashboardController } from './dashboard.controller';

describe('DashboardController', () => {
  const service = {
    getGeneralStats: jest.fn(),
    getInventoryData: jest.fn(),
    getConsumptionTrend: jest.fn(),
    getExpeditionStatus: jest.fn(),
    getPersonalPanel: jest.fn(),
  };

  let controller: DashboardController;

  beforeEach(() => {
    jest.clearAllMocks();
    controller = new DashboardController(service as never);
  });

  it('throws when request has no valid campId', async () => {
    const req = { user: { campId: 0 } } as never;

    await expect(controller.getGeneralDashboard(req)).rejects.toThrow(BadRequestException);
  });

  it('returns general dashboard payload', async () => {
    service.getGeneralStats.mockResolvedValue({ unreadNotifications: 2 });

    await expect(controller.getGeneralDashboard({ user: { campId: 3 } } as never)).resolves.toEqual(
      {
        success: true,
        data: {
          generalStats: { unreadNotifications: 2 },
        },
      },
    );

    expect(service.getGeneralStats).toHaveBeenCalledWith(3);
  });

  it('returns inventory dashboard payload', async () => {
    service.getInventoryData.mockResolvedValue({ resources: [], criticalStockCount: 0 });
    service.getConsumptionTrend.mockResolvedValue([{ date: '2026-04-27', totalConsumed: 1 }]);

    await expect(
      controller.getInventoryDashboard({ user: { campId: 3 } } as never),
    ).resolves.toEqual({
      success: true,
      data: {
        inventoryData: { resources: [], criticalStockCount: 0 },
        consumptionTrend: [{ date: '2026-04-27', totalConsumed: 1 }],
      },
    });
  });

  it('returns expeditions dashboard payload', async () => {
    service.getExpeditionStatus.mockResolvedValue({ PLANNED: 1 });

    await expect(
      controller.getExpeditionsDashboard({ user: { campId: 5 } } as never),
    ).resolves.toEqual({
      success: true,
      data: {
        expeditionStatus: { PLANNED: 1 },
      },
    });
  });

  it('returns personal panel with user id', async () => {
    service.getPersonalPanel.mockResolvedValue({ userId: 99, ok: true });

    await expect(
      controller.getPersonalPanel({ user: { userId: 99, campId: 6 } } as never),
    ).resolves.toEqual({
      success: true,
      data: { userId: 99, ok: true },
    });

    expect(service.getPersonalPanel).toHaveBeenCalledWith(6, 99);
  });

  it('returns personal panel with null user id when absent', async () => {
    service.getPersonalPanel.mockResolvedValue({ userId: null, ok: true });

    await expect(controller.getPersonalPanel({ user: { campId: 6 } } as never)).resolves.toEqual({
      success: true,
      data: { userId: null, ok: true },
    });

    expect(service.getPersonalPanel).toHaveBeenCalledWith(6, null);
  });
});
