import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Not, Repository } from 'typeorm';

import { CampEntity } from '../camp/camp.entity';
import { CampInventoryEntity } from '../campInventory/campInventory.entity';
import { DailyConsumptionEntity } from '../dailyConsumption/dailyConsumption.entity';
import { ExpeditionEntity } from '../expedition/expedition.entity';
import { InventoryAlertEntity } from '../inventoryAlert/inventoryAlert.entity';
import { InventoryMovementEntity } from '../inventoryMovement/inventoryMovement.entity';
import { OccupationEntity } from '../occupation/occupation.entity';
import { PersonEntity } from '../person/person.entity';
import { ResourceTypeEntity } from '../resourceType/resourceType.entity';
import { SystemTimeService } from '../systemTime/systemTime.service';

const MS_PER_DAY = 24 * 60 * 60 * 1000;
const SYSTEM_RECORDED_BY = 0;

@Injectable()
export class TemporalAutomationService {
  private readonly logger = new Logger(TemporalAutomationService.name);

  constructor(
    @InjectRepository(CampEntity)
    private readonly campRepo: Repository<CampEntity>,
    @InjectRepository(CampInventoryEntity)
    private readonly campInventoryRepo: Repository<CampInventoryEntity>,
    @InjectRepository(DailyConsumptionEntity)
    private readonly dailyConsumptionRepo: Repository<DailyConsumptionEntity>,
    @InjectRepository(ExpeditionEntity)
    private readonly expeditionRepo: Repository<ExpeditionEntity>,
    @InjectRepository(InventoryAlertEntity)
    private readonly inventoryAlertRepo: Repository<InventoryAlertEntity>,
    @InjectRepository(InventoryMovementEntity)
    private readonly inventoryMovementRepo: Repository<InventoryMovementEntity>,
    @InjectRepository(OccupationEntity)
    private readonly occupationRepo: Repository<OccupationEntity>,
    @InjectRepository(PersonEntity)
    private readonly personRepo: Repository<PersonEntity>,
    @InjectRepository(ResourceTypeEntity)
    private readonly resourceTypeRepo: Repository<ResourceTypeEntity>,
    private readonly systemTimeService: SystemTimeService,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async runDailyResourceCycle(): Promise<void> {
    const now = this.systemTimeService.now();
    const camps = await this.campRepo.find({ select: ['id', 'minimumDailyRationPerPerson'] });

    const foodResource = await this.resourceTypeRepo.findOne({ where: { category: 'FOOD' } });
    const waterResource = await this.resourceTypeRepo.findOne({ where: { category: 'WATER' } });

    if (!foodResource || !waterResource) {
      this.logger.warn('No se encontraron recursos FOOD/WATER para el ciclo diario');
      return;
    }

    for (const camp of camps) {
      const touchedResourceIds = new Set<number>();
      const rationPerPerson = this.toDecimal(camp.minimumDailyRationPerPerson || '1.00');

      const peopleCount = await this.personRepo.count({
        where: {
          campId: camp.id,
          currentStatus: In(['ACTIVE', 'SICK', 'INJURED']),
        },
      });

      const totalRation = this.roundTo2(peopleCount * rationPerPerson);

      await this.applyDailyConsumption(
        camp.id,
        foodResource.id,
        totalRation,
        now,
        touchedResourceIds,
      );
      await this.applyDailyConsumption(
        camp.id,
        waterResource.id,
        totalRation,
        now,
        touchedResourceIds,
      );

      const productionByResource = await this.getProductionByResource(camp.id, now);

      for (const [resourceTypeId, amount] of productionByResource.entries()) {
        if (amount <= 0) {
          continue;
        }

        const inventory = await this.getOrCreateCampInventory(camp.id, resourceTypeId);
        const currentAmount = this.toDecimal(inventory.currentAmount);
        inventory.currentAmount = this.roundTo2(currentAmount + amount).toFixed(2);
        inventory.lastUpdate = now;
        await this.campInventoryRepo.save(inventory);

        await this.inventoryMovementRepo.save(
          this.inventoryMovementRepo.create({
            campId: camp.id,
            resourceTypeId,
            amount: amount.toFixed(2),
            movementType: 'DAILY_COLLECTION',
            sourceId: null,
            sourceType: 'temporal_automation',
            recordedBy: SYSTEM_RECORDED_BY,
            date: now,
            description: 'Produccion automatica diaria',
          }),
        );

        touchedResourceIds.add(resourceTypeId);
      }

      await this.generateAlertsIfNeeded(camp.id, [...touchedResourceIds], now);
    }
  }

  @Cron(CronExpression.EVERY_HOUR)
  async runHourlyExpeditionStateUpdate(): Promise<void> {
    const now = this.systemTimeService.now();
    const expeditions = await this.expeditionRepo.find({
      where: {
        status: Not(In(['COMPLETED', 'CANCELED', 'LOST'])),
      },
    });

    if (expeditions.length === 0) {
      return;
    }

    for (const expedition of expeditions) {
      const departure = expedition.plannedDepartureDate;
      const estimatedReturn = expedition.plannedReturnDate;
      const lossLimit = new Date(
        estimatedReturn.getTime() + Math.max(0, expedition.extraDaysAvailable) * MS_PER_DAY,
      );

      let nextStatus = expedition.status;

      if (expedition.actualReturnDate) {
        nextStatus = 'COMPLETED';
      } else if (now.getTime() > lossLimit.getTime()) {
        nextStatus = 'LOST';
      } else if (now.getTime() > estimatedReturn.getTime()) {
        nextStatus = 'DELAYED';
      } else if (now.getTime() >= departure.getTime()) {
        nextStatus = 'IN_PROGRESS';
      } else {
        nextStatus = 'PLANNED';
      }

      const extraDaysUsed =
        now.getTime() > estimatedReturn.getTime()
          ? Math.max(0, Math.ceil((now.getTime() - estimatedReturn.getTime()) / MS_PER_DAY))
          : 0;

      if (nextStatus !== expedition.status || extraDaysUsed !== expedition.extraDaysUsed) {
        expedition.status = nextStatus;
        expedition.extraDaysUsed = Math.min(extraDaysUsed, expedition.extraDaysAvailable);
        await this.expeditionRepo.save(expedition);
      }
    }
  }

  private async applyDailyConsumption(
    campId: number,
    resourceTypeId: number,
    totalRation: number,
    now: Date,
    touchedResourceIds: Set<number>,
  ): Promise<void> {
    const inventory = await this.getOrCreateCampInventory(campId, resourceTypeId);
    const currentAmount = this.toDecimal(inventory.currentAmount);
    const newAmount = this.roundTo2(currentAmount - totalRation);

    inventory.currentAmount = newAmount.toFixed(2);
    inventory.lastUpdate = now;
    await this.campInventoryRepo.save(inventory);

    await this.dailyConsumptionRepo.save(
      this.dailyConsumptionRepo.create({
        fecha: now,
        campamentoId: campId,
        recursoId: resourceTypeId,
        cantidad: totalRation.toFixed(2),
        tipo: 'consumo_racion',
      }),
    );

    await this.inventoryMovementRepo.save(
      this.inventoryMovementRepo.create({
        campId,
        resourceTypeId,
        amount: (-totalRation).toFixed(2),
        movementType: 'DAILY_RATION',
        sourceId: null,
        sourceType: 'temporal_automation',
        recordedBy: SYSTEM_RECORDED_BY,
        date: now,
        description: 'Consumo automatico diario',
      }),
    );

    touchedResourceIds.add(resourceTypeId);
  }

  private async getOrCreateCampInventory(
    campId: number,
    resourceTypeId: number,
  ): Promise<CampInventoryEntity> {
    const found = await this.campInventoryRepo.findOne({
      where: { campId, resourceTypeId },
    });

    if (found) {
      return found;
    }

    const created = this.campInventoryRepo.create({
      campId,
      resourceTypeId,
      currentAmount: '0.00',
      minimumAlertAmount: '0.00',
    });

    return await this.campInventoryRepo.save(created);
  }

  private async getProductionByResource(campId: number, now: Date): Promise<Map<number, number>> {
    const rows = (await this.personRepo.query(
      `
      SELECT
        COALESCE(ta.temporary_occupation_id, p.occupation_id) AS occupation_id
      FROM person p
      LEFT JOIN LATERAL (
        SELECT temporary_occupation_id
        FROM temporary_occupation_assignment
        WHERE person_id = p.id
          AND start_date <= $2
          AND (end_date IS NULL OR end_date >= $2)
        ORDER BY start_date DESC
        LIMIT 1
      ) ta ON true
      WHERE p.camp_id = $1
        AND p.current_status NOT IN ('SICK', 'INJURED', 'OUTSIDE_CAMP')
        AND COALESCE(ta.temporary_occupation_id, p.occupation_id) IS NOT NULL
      `,
      [campId, now.toISOString()],
    )) as Array<{ occupation_id: string | number }>;

    if (rows.length === 0) {
      return new Map<number, number>();
    }

    const occupationIds = [...new Set(rows.map((row) => Number(row.occupation_id)))];
    const occupations = await this.occupationRepo.find({
      where: {
        id: In(occupationIds),
      },
      select: ['id', 'resourceTypeId', 'dailyAmountProduced'],
    });

    const occupationById = new Map(occupations.map((occupation) => [occupation.id, occupation]));
    const result = new Map<number, number>();

    for (const row of rows) {
      const occupation = occupationById.get(Number(row.occupation_id));
      if (!occupation || occupation.resourceTypeId === null) {
        continue;
      }

      const produced = this.toDecimal(occupation.dailyAmountProduced);
      if (produced <= 0) {
        continue;
      }

      const previous = result.get(occupation.resourceTypeId) ?? 0;
      result.set(occupation.resourceTypeId, this.roundTo2(previous + produced));
    }

    return result;
  }

  private async generateAlertsIfNeeded(
    campId: number,
    resourceTypeIds: number[],
    now: Date,
  ): Promise<void> {
    if (resourceTypeIds.length === 0) {
      return;
    }

    const inventories = await this.campInventoryRepo.find({
      where: {
        campId,
        resourceTypeId: In(resourceTypeIds),
      },
    });

    for (const inventory of inventories) {
      const currentAmount = this.toDecimal(inventory.currentAmount);
      const minAlert = this.toDecimal(inventory.minimumAlertAmount);

      if (currentAmount >= minAlert) {
        continue;
      }

      const unresolved = await this.inventoryAlertRepo.findOne({
        where: {
          campId,
          resourceTypeId: inventory.resourceTypeId,
          resolved: false,
        },
      });

      if (unresolved) {
        continue;
      }

      await this.inventoryAlertRepo.save(
        this.inventoryAlertRepo.create({
          campId,
          resourceTypeId: inventory.resourceTypeId,
          amountAtAlertGeneration: currentAmount.toFixed(2),
          movementId: null,
          alertDate: now,
          resolved: false,
          resolutionDate: null,
          resolvedBy: null,
        }),
      );
    }
  }

  private toDecimal(value: string | number): number {
    const parsed = typeof value === 'number' ? value : Number.parseFloat(value);
    return Number.isFinite(parsed) ? parsed : 0;
  }

  private roundTo2(value: number): number {
    return Math.round(value * 100) / 100;
  }
}
