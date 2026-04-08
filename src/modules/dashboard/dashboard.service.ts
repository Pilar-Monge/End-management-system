import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { AdmissionRequestEntity } from '../admissionRequest/admissionRequest.entity';
import { CampInventoryEntity } from '../campInventory/campInventory.entity';
import { ExpeditionEntity } from '../expedition/expedition.entity';
import { InventoryMovementEntity } from '../inventoryMovement/inventoryMovement.entity';
import { NotificationEntity } from '../notification/notification.entity';
import { PersonEntity } from '../person/person.entity';
import { ResourceTypeEntity } from '../resourceType/resourceType.entity';

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(NotificationEntity)
    private readonly notificationRepo: Repository<NotificationEntity>,
    @InjectRepository(PersonEntity)
    private readonly personRepo: Repository<PersonEntity>,
    @InjectRepository(AdmissionRequestEntity)
    private readonly admissionRequestRepo: Repository<AdmissionRequestEntity>,
    @InjectRepository(CampInventoryEntity)
    private readonly campInventoryRepo: Repository<CampInventoryEntity>,
    @InjectRepository(ResourceTypeEntity)
    private readonly resourceTypeRepo: Repository<ResourceTypeEntity>,
    @InjectRepository(ExpeditionEntity)
    private readonly expeditionRepo: Repository<ExpeditionEntity>,
    @InjectRepository(InventoryMovementEntity)
    private readonly inventoryMovementRepo: Repository<InventoryMovementEntity>,
  ) {}

  async getGeneralStats(campId: number) {
    const [unreadNotifications, totalPersons, pendingAdmissionRequests] = await Promise.all([
      this.notificationRepo.count({
        where: {
          campId,
          read: false,
        },
      }),
      this.personRepo.count({
        where: {
          campId,
        },
      }),
      this.admissionRequestRepo
        .createQueryBuilder('request')
        .where('request.campId = :campId', { campId })
        .andWhere('request.status IN (:...statuses)', {
          statuses: ['PENDING_AI', 'PENDING_ADMIN'],
        })
        .getCount(),
    ]);

    return {
      unreadNotifications,
      totalPersons,
      pendingAdmissionRequests,
    };
  }

  async getInventoryData(campId: number) {
    const rows = await this.campInventoryRepo.find({
      where: { campId },
      order: { resourceTypeId: 'ASC' },
    });

    const resourceTypeIds = rows.map((row) => row.resourceTypeId);
    const resourceTypeMap = new Map<number, string>();

    if (resourceTypeIds.length > 0) {
      const resourceTypes = await this.resourceTypeRepo
        .createQueryBuilder('resourceType')
        .where('resourceType.id IN (:...ids)', { ids: resourceTypeIds })
        .getMany();

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
    const grouped = await this.expeditionRepo
      .createQueryBuilder('expedition')
      .select('expedition.status', 'status')
      .addSelect('COUNT(*)', 'count')
      .where('expedition.campId = :campId', { campId })
      .groupBy('expedition.status')
      .getRawMany<{ status: string; count: string }>();

    const base = {
      PLANNED: 0,
      COMPLETED: 0,
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

    const rows = await this.inventoryMovementRepo
      .createQueryBuilder('movement')
      .select("TO_CHAR(DATE_TRUNC('day', movement.date), 'YYYY-MM-DD')", 'date')
      .addSelect('SUM(CAST(movement.amount AS numeric))', 'totalConsumed')
      .where('movement.campId = :campId', { campId })
      .andWhere('movement.date >= :startDate', { startDate })
      .andWhere('movement.movementType IN (:...types)', {
        types: ['DAILY_RATION', 'EXPEDITION_DEPARTURE', 'TRANSFER_SENT'],
      })
      .groupBy("DATE_TRUNC('day', movement.date)")
      .orderBy("DATE_TRUNC('day', movement.date)", 'ASC')
      .getRawMany<{ date: string; totalConsumed: string }>();

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
