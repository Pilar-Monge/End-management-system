import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { DataSource } from 'typeorm';

import { assertEntityExists } from '../../common/validation/assert-exists';
import { CampEntity } from '../camp/camp.entity';
import { InventoryMovementService } from '../inventoryMovement/inventoryMovement.service';
import { NotificationService } from '../notification/notification.service';
import { ResourceTypeEntity } from '../resourceType/resourceType.entity';
import { DailyCollectionRecordRepository } from './dailyCollectionRecord.repository';
import type {
  AdjustDailyCollectionRecordDTO,
  CreateDailyCollectionRecordDTO,
  DailyCollectionRecord,
  UpdateDailyCollectionRecordDTO,
} from './dailyCollectionRecord.model';

@Injectable()
export class DailyCollectionRecordService {
  constructor(
    private readonly repository: DailyCollectionRecordRepository,
    private readonly inventoryMovementService: InventoryMovementService,
    private readonly notificationService: NotificationService,
    private readonly dataSource: DataSource,
  ) {}

  private roundToTwo(value: number): string {
    return (Math.round(value * 100) / 100).toFixed(2);
  }

  private parseAmount(value: string): number {
    const parsed = Number.parseFloat(value);
    if (!Number.isFinite(parsed) || parsed < 0) {
      throw new BadRequestException('La cantidad debe ser un numero valido mayor o igual a 0');
    }

    return parsed;
  }

  private toCalendarDate(value: Date): Date {
    return new Date(Date.UTC(value.getUTCFullYear(), value.getUTCMonth(), value.getUTCDate()));
  }

  private async validateCampConsistency(
    campId: number,
    personId: number,
    recordedBy: number,
    resourceTypeId: number,
    movementId?: number | null,
  ): Promise<void> {
    await assertEntityExists(this.dataSource, CampEntity, campId, 'Camp');
    await assertEntityExists(this.dataSource, ResourceTypeEntity, resourceTypeId, 'Resource type');

    const person = await this.repository.findPersonById(personId);
    if (!person) {
      throw new NotFoundException('Persona no encontrada');
    }

    if (person.campId !== campId) {
      throw new BadRequestException('La persona no pertenece al campamento proporcionado');
    }

    const user = await this.repository.findUserById(recordedBy);
    if (!user) {
      throw new NotFoundException('No se encontro el usuario que registro la recoleccion');
    }

    if (user.campId !== campId) {
      throw new BadRequestException(
        'El usuario recordedBy no pertenece al campamento proporcionado',
      );
    }

    if (movementId === null || movementId === undefined) {
      return;
    }

    const movement = await this.repository.findMovementById(movementId);
    if (!movement) {
      throw new NotFoundException('Movimiento de inventario no encontrado');
    }

    if (movement.campId !== campId) {
      throw new BadRequestException('El movimiento no pertenece al campamento proporcionado');
    }

    if (movement.resourceTypeId !== resourceTypeId) {
      throw new BadRequestException(
        'El tipo de recurso del movimiento no coincide con resourceTypeId',
      );
    }
  }

  async createRecord(data: CreateDailyCollectionRecordDTO): Promise<DailyCollectionRecord> {
    await this.validateCampConsistency(
      data.campId,
      data.personId,
      data.recordedBy,
      data.resourceTypeId,
      data.movementId,
    );

    const existing = await this.repository.findByPersonResourceDay(
      data.personId,
      data.resourceTypeId,
      data.date,
    );

    if (existing) {
      throw new Error(
        'Ya existe un registro de recoleccion diaria para esta persona, tipo de recurso y fecha',
      );
    }

    const created = await this.repository.create(data);
    await this.notificationService.notifyCampRoles(
      created.campId,
      ['RESOURCE_MANAGEMENT', 'SYSTEM_ADMIN'],
      {
        type: 'INVENTORY_ALERT',
        title: 'Registro diario de recoleccion creado',
        message: `Se registro una recoleccion diaria para el recurso ${created.resourceTypeId}.`,
        sourceType: 'daily_collection_record',
        sourceId: created.id,
      },
    );
    return created;
  }

  async adjustRecord(
    id: number,
    data: AdjustDailyCollectionRecordDTO,
  ): Promise<DailyCollectionRecord | null> {
    const existing = await this.repository.findById(id);
    if (!existing) {
      return null;
    }

    const recordedByUser = await this.repository.findUserById(data.recordedBy);
    if (!recordedByUser) {
      throw new NotFoundException('No se encontro el usuario que registro el ajuste');
    }

    if (recordedByUser.campId !== existing.campId) {
      throw new BadRequestException('El usuario que registra el ajuste no pertenece al campamento');
    }

    const previousActualAmount = this.parseAmount(existing.actualAmount);
    const nextActualAmount = this.parseAmount(data.actualAmount);
    const delta = this.roundToTwo(nextActualAmount - previousActualAmount);

    const updated = await this.repository.update(id, {
      actualAmount: nextActualAmount.toFixed(2),
      differenceReason: data.differenceReason ?? existing.differenceReason,
      recordedBy: data.recordedBy,
    });

    if (!updated) {
      return null;
    }

    if (Number.parseFloat(delta) !== 0) {
      const movement = await this.inventoryMovementService.createMovement({
        campId: existing.campId,
        resourceTypeId: existing.resourceTypeId,
        amount: delta,
        movementType: 'MANUAL_ADJUSTMENT',
        sourceId: existing.id,
        sourceType: 'daily_collection_record',
        recordedBy: data.recordedBy,
        date: this.toCalendarDate(existing.date),
        description:
          data.differenceReason ??
          `Ajuste manual del ingreso diario del registro ${existing.id}`,
      });

      await this.repository.update(id, { movementId: movement.id });
      return await this.repository.findById(id);
    }

    return updated;
  }

  async getRecordById(id: number): Promise<DailyCollectionRecord | null> {
    return await this.repository.findById(id);
  }

  async getAllRecords(filters?: {
    campId?: number;
    personId?: number;
    resourceTypeId?: number;
    date?: string;
    page?: number;
    limit?: number;
  }): Promise<{ data: DailyCollectionRecord[]; total: number }> {
    const page = filters?.page ?? 1;
    const limit = filters?.limit ?? 10;
    const offset = (page - 1) * limit;

    const repoFilters: {
      campId?: number;
      personId?: number;
      resourceTypeId?: number;
      date?: string;
      offset: number;
      limit: number;
    } = {
      offset,
      limit,
    };

    if (filters?.campId !== undefined) repoFilters.campId = filters.campId;
    if (filters?.personId !== undefined) repoFilters.personId = filters.personId;
    if (filters?.resourceTypeId !== undefined) repoFilters.resourceTypeId = filters.resourceTypeId;
    if (filters?.date !== undefined) repoFilters.date = filters.date;

    return await this.repository.findAllAndCount(repoFilters);
  }

  async updateRecord(
    id: number,
    data: UpdateDailyCollectionRecordDTO,
  ): Promise<DailyCollectionRecord | null> {
    const existing = await this.repository.findById(id);
    if (!existing) return null;

    const campId = data.campId ?? existing.campId;
    const personId = data.personId ?? existing.personId;
    const recordedBy = data.recordedBy ?? existing.recordedBy;
    const resourceTypeId = data.resourceTypeId ?? existing.resourceTypeId;
    const movementId = data.movementId !== undefined ? data.movementId : existing.movementId;

    await this.validateCampConsistency(campId, personId, recordedBy, resourceTypeId, movementId);

    const updated = await this.repository.update(id, data);
    if (!updated) {
      return null;
    }

    await this.notificationService.notifyCampRoles(
      updated.campId,
      ['RESOURCE_MANAGEMENT', 'SYSTEM_ADMIN'],
      {
        type: 'INVENTORY_ALERT',
        title: 'Registro diario de recoleccion actualizado',
        message: `El registro diario ${updated.id} fue actualizado.`,
        sourceType: 'daily_collection_record',
        sourceId: updated.id,
      },
    );

    return updated;
  }

  async deleteRecord(id: number): Promise<boolean> {
    const existing = await this.repository.findById(id);
    if (!existing) {
      return false;
    }

    const deleted = await this.repository.delete(id);
    if (!deleted) {
      return false;
    }

    await this.notificationService.notifyCampRoles(
      existing.campId,
      ['RESOURCE_MANAGEMENT', 'SYSTEM_ADMIN'],
      {
        type: 'INVENTORY_ALERT',
        title: 'Registro diario de recoleccion eliminado',
        message: `El registro diario ${existing.id} fue eliminado.`,
        sourceType: 'daily_collection_record',
        sourceId: existing.id,
      },
    );

    return true;
  }
}
