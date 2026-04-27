import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CampInventoryEntity } from '../campInventory/campInventory.entity';
import { InventoryMovementEntity } from './inventoryMovement.entity';
import type {
  CreateInventoryMovementDTO,
  InventoryMovement,
  InventoryMovementType,
  UpdateInventoryMovementDTO,
} from './inventoryMovement.model';

@Injectable()
export class InventoryMovementRepository {
  constructor(
    @InjectRepository(InventoryMovementEntity)
    private readonly repo: Repository<InventoryMovementEntity>,
  ) {}

  private getSignedDelta(movementType: InventoryMovementType, amount: number): number {
    if (
      movementType === 'DAILY_RATION' ||
      movementType === 'EXPEDITION_DEPARTURE' ||
      movementType === 'TRANSFER_SENT'
    ) {
      return -amount;
    }

    return amount;
  }

  async create(data: CreateInventoryMovementDTO): Promise<InventoryMovement> {
    return await this.repo.manager.transaction(async (manager) => {
      const movementRepo = manager.getRepository(InventoryMovementEntity);
      const entity = movementRepo.create({
        campId: data.campId,
        resourceTypeId: data.resourceTypeId,
        amount: data.amount,
        movementType: data.movementType,
        sourceId: data.sourceId ?? null,
        sourceType: data.sourceType ?? null,
        recordedBy: data.recordedBy,
        ...(data.date !== undefined ? { date: data.date } : {}),
        description: data.description ?? null,
      });

      const saved = await movementRepo.save(entity);
      const numericAmount = Number.parseFloat(String(data.amount));
      const delta = this.getSignedDelta(data.movementType, numericAmount);

      if (delta >= 0) {
        await manager.query(
          `INSERT INTO public.camp_inventory (
              camp_id,
              resource_type_id,
              current_amount,
              minimum_alert_amount,
              last_update
           ) VALUES ($1, $2, $3, '0.00', NOW())
           ON CONFLICT (camp_id, resource_type_id)
           DO UPDATE SET
             current_amount = (public.camp_inventory.current_amount::numeric + EXCLUDED.current_amount::numeric)::numeric(12,2),
             last_update = NOW()`,
          [data.campId, data.resourceTypeId, delta.toFixed(2)],
        );
      } else {
        const consumedAmount = Math.abs(delta);
        const updateResult = (await manager.query(
          `UPDATE public.camp_inventory
           SET current_amount = (current_amount::numeric - $3::numeric)::numeric(12,2),
               last_update = NOW()
           WHERE camp_id = $1
             AND resource_type_id = $2
             AND current_amount::numeric >= $3::numeric
           RETURNING camp_id`,
          [data.campId, data.resourceTypeId, consumedAmount.toFixed(2)],
        )) as Array<{ camp_id: number }>;

        if (updateResult.length === 0) {
          throw new Error('Insufficient camp inventory for this movement');
        }
      }

      return saved;
    });
  }

  async findById(id: number): Promise<InventoryMovement | null> {
    return await this.repo.findOne({ where: { id } });
  }

  async findCampInventory(
    campId: number,
    resourceTypeId: number,
  ): Promise<CampInventoryEntity | null> {
    return await this.repo.manager.getRepository(CampInventoryEntity).findOne({
      where: { campId, resourceTypeId },
    });
  }

  async findAllAndCount(filters?: {
    campId?: number;
    resourceTypeId?: number;
    movementType?: InventoryMovementType;
    recordedBy?: number;
    offset?: number;
    limit?: number;
  }): Promise<{ data: InventoryMovement[]; total: number }> {
    const qb = this.repo.createQueryBuilder('mov');

    if (filters?.campId !== undefined) {
      qb.andWhere('mov.campId = :campId', { campId: filters.campId });
    }

    if (filters?.resourceTypeId !== undefined) {
      qb.andWhere('mov.resourceTypeId = :resourceTypeId', {
        resourceTypeId: filters.resourceTypeId,
      });
    }

    if (filters?.movementType !== undefined) {
      qb.andWhere('mov.movementType = :movementType', {
        movementType: filters.movementType,
      });
    }

    if (filters?.recordedBy !== undefined) {
      qb.andWhere('mov.recordedBy = :recordedBy', {
        recordedBy: filters.recordedBy,
      });
    }

    qb.orderBy('mov.date', 'DESC');

    if (filters?.limit !== undefined) {
      qb.take(filters.limit);
    }

    if (filters?.offset !== undefined) {
      qb.skip(filters.offset);
    }

    const [data, total] = await qb.getManyAndCount();
    return { data, total };
  }

  async update(id: number, data: UpdateInventoryMovementDTO): Promise<InventoryMovement | null> {
    const existing = await this.repo.findOne({ where: { id } });
    if (!existing) return null;

    const cleaned = Object.fromEntries(
      Object.entries(data).filter(([, value]) => value !== undefined),
    ) as Partial<InventoryMovementEntity>;

    Object.assign(existing, cleaned);
    return await this.repo.save(existing);
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.repo.delete({ id });
    return (result.affected ?? 0) > 0;
  }
}
