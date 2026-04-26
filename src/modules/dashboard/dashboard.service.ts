import { Injectable } from '@nestjs/common';
import { DashboardRepository } from './dashboard.repository';

@Injectable()
export class DashboardService {
  constructor(private readonly repository: DashboardRepository) {}

  async getGeneralStats(campId: number) {
    const [unreadNotifications, totalPersons, pendingAdmissionRequests] = await Promise.all([
      this.repository.countUnreadNotifications(campId),
      this.repository.countPersonsByCamp(campId),
      this.repository.countPendingAdmissionRequests(campId),
    ]);

    return {
      unreadNotifications,
      totalPersons,
      pendingAdmissionRequests,
    };
  }

  async getInventoryData(campId: number) {
    const rows = await this.repository.findCampInventoryRows(campId);

    const resourceTypeIds = rows.map((row) => row.resourceTypeId);
    const resourceTypeMap = new Map<number, string>();

    if (resourceTypeIds.length > 0) {
      const resourceTypes = await this.repository.findResourceTypesByIds(resourceTypeIds);

      resourceTypes.forEach((resourceType) => {
        resourceTypeMap.set(resourceType.id, resourceType.name);
      });
    }

    const resources = rows.map((row) => ({
      resourceName: resourceTypeMap.get(row.resourceTypeId) ?? `Resource ${row.resourceTypeId}`,
      currentAmount: Number.parseFloat(row.currentAmount),
    }));

    const criticalStockCount = rows.filter(
      (row) => Number.parseFloat(row.currentAmount) <= Number.parseFloat(row.minimumAlertAmount),
    ).length;

    return {
      resources,
      criticalStockCount,
    };
  }

  async getExpeditionStatus(campId: number) {
    const grouped = await this.repository.countExpeditionsByStatus(campId);

    const base = {
      PLANNED: 0,
      IN_PROGRESS: 0,
      DELAYED: 0,
      COMPLETED: 0,
      LOST: 0,
      RETURNED_AFTER_LOST: 0,
      CANCELED: 0,
    };

    for (const row of grouped) {
      if (row.status in base) {
        base[row.status as keyof typeof base] = Number.parseInt(row.count, 10);
      }
    }

    return base;
  }

  async getConsumptionTrend(campId: number) {
    const startDate = new Date();
    startDate.setHours(0, 0, 0, 0);
    startDate.setDate(startDate.getDate() - 6);

    const rows = await this.repository.findConsumptionRows(campId, startDate);

    const totalsByDate = new Map<string, number>();
    rows.forEach((row) => {
      totalsByDate.set(row.date, Number.parseFloat(row.totalConsumed));
    });

    const trend: Array<{ date: string; totalConsumed: number }> = [];
    for (let i = 0; i < 7; i += 1) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      const dateKey = date.toISOString().slice(0, 10);
      trend.push({
        date: dateKey,
        totalConsumed: totalsByDate.get(dateKey) ?? 0,
      });
    }

    return trend;
  }

  async getPersonalPanel(campId: number, userId: number | null) {
    const [general, inventory, expeditions, consumptionTrend] = await Promise.all([
      this.getGeneralStats(campId),
      this.getInventoryData(campId),
      this.getExpeditionStatus(campId),
      this.getConsumptionTrend(campId),
    ]);

    return {
      userId,
      general,
      inventory,
      expeditions,
      consumptionTrend,
    };
  }
}
