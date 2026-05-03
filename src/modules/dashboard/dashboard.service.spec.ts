import { DashboardService } from './dashboard.service';

describe('DashboardService', () => {
  let service: DashboardService;
  const repository = {
    countUnreadNotifications: jest.fn(),
    countPersonsByCamp: jest.fn(),
    countPendingAdmissionRequests: jest.fn(),
    findCampInventoryRows: jest.fn(),
    findResourceTypesByIds: jest.fn(),
    countExpeditionsByStatus: jest.fn(),
    findConsumptionRows: jest.fn(),
  };

  const systemTimeService = {
    now: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers().setSystemTime(new Date('2026-04-26T10:00:00.000Z'));
    systemTimeService.now.mockReturnValue(new Date('2026-04-26T10:00:00.000Z'));
    service = new DashboardService(repository as never, systemTimeService as never);
  });


  afterEach(() => {
    jest.useRealTimers();
  });

  it('returns general stats', async () => {
    repository.countUnreadNotifications.mockResolvedValue(5);
    repository.countPersonsByCamp.mockResolvedValue(40);
    repository.countPendingAdmissionRequests.mockResolvedValue(3);

    await expect(service.getGeneralStats(7)).resolves.toEqual({
      unreadNotifications: 5,
      totalPersons: 40,
      pendingAdmissionRequests: 3,
    });
  });

  it('builds inventory data and critical stock count', async () => {
    repository.findCampInventoryRows.mockResolvedValue([
      { resourceTypeId: 1, currentAmount: '10', minimumAlertAmount: '12' },
      { resourceTypeId: 2, currentAmount: '5.5', minimumAlertAmount: '5.5' },
      { resourceTypeId: 99, currentAmount: '2', minimumAlertAmount: '1' },
    ]);
    repository.findResourceTypesByIds.mockResolvedValue([
      { id: 1, name: 'Water' },
      { id: 2, name: 'Food' },
    ]);

    await expect(service.getInventoryData(1)).resolves.toEqual({
      resources: [
        { resourceName: 'Water', currentAmount: 10 },
        { resourceName: 'Food', currentAmount: 5.5 },
        { resourceName: 'Resource 99', currentAmount: 2 },
      ],
      criticalStockCount: 2,
    });

    expect(repository.findResourceTypesByIds).toHaveBeenCalledWith([1, 2, 99]);
  });

  it('handles inventory with no rows', async () => {
    repository.findCampInventoryRows.mockResolvedValue([]);

    await expect(service.getInventoryData(1)).resolves.toEqual({
      resources: [],
      criticalStockCount: 0,
    });

    expect(repository.findResourceTypesByIds).not.toHaveBeenCalled();
  });

  it('maps expedition grouped counts into base object', async () => {
    repository.countExpeditionsByStatus.mockResolvedValue([
      { status: 'PLANNED', count: '4' },
      { status: 'IN_PROGRESS', count: '2' },
      { status: 'UNKNOWN', count: '99' },
    ]);

    await expect(service.getExpeditionStatus(10)).resolves.toEqual({
      PLANNED: 4,
      IN_PROGRESS: 2,
      DELAYED: 0,
      COMPLETED: 0,
      LOST: 0,
      RETURNED_AFTER_LOST: 0,
      CANCELED: 0,
    });
  });

  it('returns 7-day consumption trend with zeros for missing dates', async () => {
    repository.findConsumptionRows.mockResolvedValue([
      { date: '2026-04-20', totalConsumed: '1.5' },
      { date: '2026-04-24', totalConsumed: '8' },
      { date: '2026-04-26', totalConsumed: '3' },
    ]);

    await expect(service.getConsumptionTrend(4)).resolves.toEqual([
      { date: '2026-04-20', totalConsumed: 1.5 },
      { date: '2026-04-21', totalConsumed: 0 },
      { date: '2026-04-22', totalConsumed: 0 },
      { date: '2026-04-23', totalConsumed: 0 },
      { date: '2026-04-24', totalConsumed: 8 },
      { date: '2026-04-25', totalConsumed: 0 },
      { date: '2026-04-26', totalConsumed: 3 },
    ]);
  });

  it('builds personal panel from all dashboard sections', async () => {
    const general = { unreadNotifications: 1, totalPersons: 2, pendingAdmissionRequests: 3 };
    const inventory = { resources: [{ resourceName: 'Water', currentAmount: 7 }], criticalStockCount: 0 };
    const expeditions = {
      PLANNED: 1,
      IN_PROGRESS: 0,
      DELAYED: 0,
      COMPLETED: 0,
      LOST: 0,
      RETURNED_AFTER_LOST: 0,
      CANCELED: 0,
    };
    const consumptionTrend = [{ date: '2026-04-26', totalConsumed: 2 }];

    jest.spyOn(service, 'getGeneralStats').mockResolvedValue(general);
    jest.spyOn(service, 'getInventoryData').mockResolvedValue(inventory);
    jest.spyOn(service, 'getExpeditionStatus').mockResolvedValue(expeditions);
    jest.spyOn(service, 'getConsumptionTrend').mockResolvedValue(consumptionTrend);

    await expect(service.getPersonalPanel(2, 99)).resolves.toEqual({
      userId: 99,
      general,
      inventory,
      expeditions,
      consumptionTrend,
    });
  });
});