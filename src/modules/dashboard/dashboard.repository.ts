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
export class DashboardRepository {
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

  async countUnreadNotifications(campId: number): Promise<number> {
    return await this.notificationRepo.count({
      where: {
        campId,
        read: false,
      },
    });
  }

  async countPersonsByCamp(campId: number): Promise<number> {
    return await this.personRepo.count({
      where: {
        campId,
      },
    });
  }

  async countPendingAdmissionRequests(campId: number): Promise<number> {
    return await this.admissionRequestRepo
      .createQueryBuilder('request')
      .where('request.campId = :campId', { campId })
      .andWhere('request.status IN (:...statuses)', {
        statuses: ['PENDING_AI', 'PENDING_ADMIN'],
      })
      .getCount();
  }

  async findCampInventoryRows(campId: number): Promise<CampInventoryEntity[]> {
    return await this.campInventoryRepo.find({
      where: { campId },
      order: { resourceTypeId: 'ASC' },
    });
  }

  async findResourceTypesByIds(ids: number[]): Promise<ResourceTypeEntity[]> {
    if (ids.length === 0) {
      return [];
    }

    return await this.resourceTypeRepo
      .createQueryBuilder('resourceType')
      .where('resourceType.id IN (:...ids)', { ids })
      .getMany();
  }

  async countExpeditionsByStatus(
    campId: number,
  ): Promise<Array<{ status: string; count: string }>> {
    return await this.expeditionRepo
      .createQueryBuilder('expedition')
      .select('expedition.status', 'status')
      .addSelect('COUNT(*)', 'count')
      .where('expedition.campId = :campId', { campId })
      .groupBy('expedition.status')
      .getRawMany<{ status: string; count: string }>();
  }

  async findConsumptionRows(
    campId: number,
    startDate: Date,
  ): Promise<Array<{ date: string; totalConsumed: string }>> {
    return await this.inventoryMovementRepo
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
  }
}
